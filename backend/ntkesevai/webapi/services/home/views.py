from rest_framework import permissions, viewsets
from rest_framework import routers

from ntkesevai.webapi.services.home.serializers import HomepageSerializer, SocialMediaSerializer,ContactSerializer
from ntkesevai.webapi.models import HomePageDetails, SocialMediaDetails, ContactDetails

class HomePageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  # Allow anyone to access
    queryset = HomePageDetails.objects.all()
    serializer_class = HomepageSerializer

class SocialMediaViewSet(viewsets.ModelViewSet):
    queryset = SocialMediaDetails.objects.all()
    serializer_class = SocialMediaSerializer

class ContactsViewSet(viewsets.ModelViewSet):
    queryset = ContactDetails.objects.all()
    serializer_class = ContactSerializer

router = routers.DefaultRouter()
router.register(r'appdetailslist', HomePageViewSet, basename='home')
router.register(r'socialmedialist', SocialMediaViewSet)
router.register(r'contactlist', ContactsViewSet)
urlPatterns = router.urls