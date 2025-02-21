
from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework import routers

from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, User

from .serializers import GroupSerializer, UserSerializer

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
    permission_classes = permissions.AllowAny  # Allow anyone to access

    @action(detail=False, methods=['post'])
    def GetLogin(self, request):
        print('request ' , request.data.get('username'))
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username =username, password = password)

        if user is None:
            return Response({'Error: Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'created':created})

class CustomAuthToken(ObtainAuthToken):
    serializer_class = UserSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

@permission_classes([permissions.IsAuthenticated, IsAdminOrReadOnly])
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', GroupViewSet)
urlpatterns = router.urls