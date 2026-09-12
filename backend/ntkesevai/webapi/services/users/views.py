import os
from django.urls import path, include
from datetime import datetime, timedelta
from rest_framework.decorators import permission_classes, action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import AllowAny

from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from rest_framework.settings import api_settings
from rest_framework import routers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, User
from ntkesevai.webapi.models.user_models import UserDetails
from .serializers import GroupSerializer, UserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer

from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from rest_framework.views import APIView


class GenerateToken:
    def __init__(self):
        pass

    TOKEN_SALT = 'DAYANIVI'

    def xor_cipher(self, last_digits, key):
        return last_digits ^ key

    def generate_reset_token(self, user):
        serializer = URLSafeTimedSerializer("123456")
        return serializer.dumps(user, salt=self.TOKEN_SALT)

    def verify_reset_token(self, token):
        serializer = URLSafeTimedSerializer("123456")
        try:
            timeout = int(os.getenv("PASSWORD_RESET_TIMEOUT", 900))
            user_pk = serializer.loads(token, salt=self.TOKEN_SALT, max_age=timeout)
            print('user_pk', user_pk)
            return user_pk
        except (SignatureExpired, BadSignature):
            return None


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print('user ', {user.email})
            user.set_password(request.data['password'])
            user.save()

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if 'password' in request.data:
            instance.set_password(request.data['password'])
            instance.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def GetLogin(self, request):
        # 1. Capture payload keys cleanly even if React maps to 'email' instead of 'username'
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username/email and password.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # 2. Authenticate cleanly without manual unsafe .get() blocks
        user = authenticate(request, username=username, password=password)
        print('Authenticated user ?', user)

        if user is None:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # 3. Handle Tokenization
        token, created = Token.objects.get_or_create(user=user)

        # 4. Map internal permissions and roles
        user_permissions = list(user.get_all_permissions())
        group_names = [group.name for group in user.groups.all()]
        isCreator = 'Creators_Group' in group_names
        isApprover = 'Approvers_Group' in group_names

        # 5. Reuse your multipurpose UserSerializer to extract combined data tables automatically
        user_serialized_data = UserSerializer(user, context={'request': request}).data

        # 6. Build response payload (password hash removed for frontend security clearance)
        return Response({
            'token': token.key,
            'message': 'Login successful',
            'isCreator': isCreator,
            'isApprover': isApprover,
            'isSuperUser': user.is_superuser,
            'permissions': user_permissions,
            **user_serialized_data  # Unpacks id, username, first_name, last_name, email, and user_details dict
        }, status=status.HTTP_200_OK)

# Add this decorator class wrapper to allow React to connect without CSRF cookie matching
@method_decorator(csrf_exempt, name='dispatch')
class CustomAuthToken(ObtainAuthToken):
    """
    Standard class endpoint override.
    Safely utilizes base configuration settings without corrupting local sign-up constraints.
    """

    def post(self, request, *args, **kwargs):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Credentials required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)
        group_names = [group.name for group in user.groups.all()]
        user_serialized_data = UserSerializer(user, context={'request': request}).data

        return Response({
            'token': token.key,
            'isCreator': 'Creators_Group' in group_names,
            'isApprover': 'Approvers_Group' in group_names,
            'isSuperUser': user.is_superuser,
            'permissions': list(user.get_all_permissions()),
            **user_serialized_data
        }, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer


class ForgotPasswordView(APIView, GenerateToken):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                specific_user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'ok': False, 'error': 'User with this email does not exist.'},
                                status=status.HTTP_404_NOT_FOUND)
            except User.MultipleObjectsReturned:
                return Response({'ok': False, 'error': 'User with this email has multiple records.'},
                                status=status.HTTP_404_NOT_FOUND)

            try:
                details_for_user = UserDetails.objects.get(user=specific_user.id)
                last_six_digits = int(details_for_user.mobile[:6]) if details_for_user.mobile else 0
                print('last six digit mobile', last_six_digits)
                key = 123456
                otp = self.xor_cipher(last_six_digits, key)
                print('otp generated', otp)

                # Code snippet cut off here in your original input. Ensure to close out your return structure.
                return Response({'ok': True, 'message': 'OTP generated successfully.'}, status=status.HTTP_200_OK)
            except UserDetails.DoesNotExist:
                return Response({'ok': False, 'error': 'User profile details missing.'},
                                status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView, GenerateToken):
    permission_classes = [AllowAny]  # This allows public access to login

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            newpassword = serializer.validated_data['password']
            try:
                try:
                    print('Token', token)
                    user_pk = verify_reset_token(token)
                except Exception:
                    return Response({'ok': False, 'error': 'இணைப்பு காலாவதியானது'},
                                    status=status.HTTP_400_BAD_REQUEST)
                user = User.objects.get(id=user_pk)
                user.set_password(newpassword)
                user.save()
                return Response({'ok': True, 'message': 'Password saved successfully.'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'ok': False, 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', GroupViewSet, basename='groups')
urlpatterns = router.urls