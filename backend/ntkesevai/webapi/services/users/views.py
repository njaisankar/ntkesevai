
from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.mail import send_mail
from rest_framework.settings import api_settings
from rest_framework import routers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, User
from ntkesevai.webapi.models.user_models import UserDetails
from .serializers import GroupSerializer, UserSerializer, ForgotPasswordSerializer
from itsdangerous import URLSafeTimedSerializer
from .serializers import ResetPasswordSerializer
    
def xor_cipher(number, key):
    return number ^ key

def generate_reset_token(user):
    print(user)
    serializer = URLSafeTimedSerializer("123456")
    return serializer.dumps(user)

def verify_reset_token(token):
    serializer = URLSafeTimedSerializer("123456")
    try:
        user_pk = serializer.loads(token, max_age=900) #15 minutes
        return user_pk
    except Exception:
         "Token relared error: Token might be expired."

class IsAdminOrReadOnly(permissions.BasePermission): 
    def has_permission(self, request, view): 
        if request.method in permissions.SAFE_METHODS: 
            return True 
        return request.user and request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    #permission_classes = permissions.AllowAny  # Allow anyone to access
    def create(self, request, *args, **kwargs):
        print('request',request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save() #This creates the user object, but does not hash the password.
        user.set_password(request.data['password']) #This hashes the password.
        user.save() #This saves the hashed password.

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
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
        print(request.data.get('username'))
        username = request.data.get('username')
        password = request.data.get('password')

        user_obj = User.objects.get(username=username)
        print('Password is correct?', user_obj.check_password(password)) # Should return True if password is correct and hashed properly

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)
        print(username)
        print(password)
        #user1 = User.objects.get(email=username)
        #print(user1.username)
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is None:
            return Response({'Error: Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
       # 1. Get or create the authentication token
        token, created = Token.objects.get_or_create(user=user)

        # 2. Get first_name and last_name
        first_name = user.first_name
        last_name = user.last_name

        # 3. Get all user permissions
        # user.get_all_permissions() returns a set of permission strings (e.g., 'myapp.add_myrecord')
        user_permissions = list(user.get_all_permissions())
     
        # To get a QuerySet of all groups the user belongs to:
        user_groups = user.groups.all()

        print("User belongs to these groups:")
        for group in user_groups:
            print(f"- {group.name}")

        # To check if a user is in a specific group (case-sensitive):
        if user.groups.filter(name='Creators_Group').exists():
            print("User is a member of the 'Creators_Group'.")
        else:
            print("User is NOT a member of the 'Creators_Group'.")

        # More Pythonic way to check group membership if you only need the name:
        group_names = [group.name for group in user.groups.all()]
        isCreator = 'Creators_Group' in group_names
        isApprover = 'Approvers_Group' in group_names
        
        # 4. Return the comprehensive response
        return Response({
            'token': token.key,
            'user_id': user.id, # Often useful for the frontend
            'username': user.username, # Also useful
            'password': user.password, # Password of the user
            'email': user.email, # Email of the user
            'is_active': user.is_active, # Check if the user is active
            'first_name': first_name,
            'last_name': last_name,
            'permissions': user_permissions,
            'message': 'Login successful', # Optional success message
            'isCreator': isCreator,
            'isApprover': isApprover,
        }, status=status.HTTP_200_OK)

# class PasswordResetViewSet(viewsets.ViewSet):
#     #queryset = User.objects.none()  
#     #serializer_class = ForgotPasswordSerializer
#     @action(detail=False, methods=['post'], url_path='forgot-password')
#     def forgot_password(self, request):
#         #serializer = self.get_serializer(data=request.data)
#         serializer = ForgotPasswordSerializer(data=request.data)
#         if serializer.is_valid():
           
#             email = serializer.validated_data['email']
#             try:
#                 print('request ' , email)
                
#                 if not email:
#                     return Response({'error': 'Please provide email address.'}, status=status.HTTP_400_BAD_REQUEST)
                
#                 user = User.objects.all().filter(email)
                
#                 if user is None:
#                     return Response({'Error: Email address not exists'}, status=status.HTTP_204_NO_CONTENT)

#                 print(user)
#                 token = default_token_generator.make_token(user['email'])
#                 reset_url = f'{api_settings.RESET_PASSWORD_LINK}/reset-password/{token}'
                
#                 send_mail("NTK - Forgot Password", f"Forgot password - reset link {reset_url}", "njaisankar@gmail.com","njaisankar@gmail.com",True)
#                 return Response({'message': 'Password reset link sent.'}, status=status.HTTP_200_OK)
#             except:
#                 print('user does not exits')
#         else:
#             print('invalid serializer')
#         return Response({'Error: '}, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    serializer_class = UserSerializer
    #renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

#@permission_classes([permissions.IsAuthenticated, IsAdminOrReadOnly])
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer

from rest_framework.views import APIView

class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email'] #json data {'email':'email id'}
            try:
                specific_user = User.objects.get(email=email)
            except specific_user.DoesNotExist:
                return Response({'Error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            except specific_user.MultipleObjectsReturned:
                return Response({'Error': 'User with this email has multiple records.'}, status=status.HTTP_404_NOT_FOUND)

            try:
                details_for_user = UserDetails.objects.get(user=specific_user.id)
                
                #email otp
                # last_six_digits = int(details_for_user.mobile[:6])
                # key=123456
                # otp = xor_cipher(last_six_digits, key)

                token = generate_reset_token(specific_user.id)
                print(f"token: {token}")
                to_email=["njaisankar@gmail.com"]
                from_email=("njaisankar@gmail.com")
                reset_url = f'http://localhost:3000/ResetPassword/{token}'
                subject = "NTK - Forgot Password"
                bodyMessage = f"Forgot password - reset link {reset_url}"
                result=send_mail(subject, bodyMessage, from_email,to_email,True)
                #print(result)
            except details_for_user.DoesNotExist:
                return Response({'error': 'User with this email does not linked.'}, status=status.HTTP_404_NOT_FOUND)
            except details_for_user.MultipleObjectsReturned:
                return Response({'Error': 'User with this email has multiple records.'}, status=status.HTTP_404_NOT_FOUND)
                
            return Response({'message': 'Password reset link sent.'}, status=status.HTTP_200_OK)
        else:
            print('email does not exist')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        print(request.data)
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            newpassword = serializer.validated_data['password']
            try:
                try:
                    user_pk=verify_reset_token(token)
                except Exception:
                    return Response({'Token expiration error:'}, status=status.HTTP_400_BAD_REQUEST)
            
                print(f'user pk {user_pk}')
                user = User.objects.get(id=user_pk)
                #token = default_token_generator.make_token(user)
                print(user)
                #token ="XER3333£4333333" #default_token_generator.make_token(user.email)
                user.set_password(newpassword)
                user.save()
                print(user.password)
                print(user.username)
                print(user.email)
                print('Is actve: ', user.is_active)
                print('Is Super user: ', user.is_superuser)
                print('Is staff: ',user.is_staff)
                return Response({'message': 'Password save successfully.'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            print('serilaization error')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', GroupViewSet, basename='groups')
urlpatterns = router.urls
