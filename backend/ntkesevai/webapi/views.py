# from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import Group, User
#from .models import Service
from rest_framework import permissions, viewsets

#from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from .serializers import GroupSerializer, UserSerializer
#from .serializers import ServiceSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection
from .serializers import ServiceSerializer, ServiceDetailsSerializer, RevenueVillageSerializer
from .serializers import DistrictSerializer, ServiceRequestSerializer, HomepageSerializer, SocialMediaSerializer, ContactSerializer
from .models import Service, ServiceDetails, RevenueVillageDetails, DistrictDetails, ServiceRequestDetails, HomePageDetails, SocialMediaDetails, ContactDetails
import logging
logger = logging.getLogger(__name__)

class IsAdminOrReadOnly(permissions.BasePermission): 
    def has_permission(self, request, view): 
        if request.method in permissions.SAFE_METHODS: 
            return True 
        return request.user and request.user.is_staff

#@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    #permission_classes = [permissions.IsAuthenticated]

# class ServiceViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Service.objects.all().order_by('serviceid')
#     serializer_class = ServiceSerializer
#     permission_classes = [permissions.IsAuthenticated]



def api_root(request):
    return JsonResponse({
        "message": "Welcome to the API. Available endpoints:",
        "services": "/api/services/",
        "services1": "/api/services1/",
        "servicesdetails": "/api/servicesdetails/",
        "revenuevillagelist": "/api/revenuevillagelist/"
    })

class ServiceView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT Service_Id,Service_Name FROM service")
            rows = cursor.fetchall()
            print(rows)
            print(cursor.description)
            columns = [col[0] for col in cursor.description]
            print(columns)

            #manual mapping
            services = [ 
               { 
                   'service_id': row[0], 
                   'service_name':row[1]
               } for row in rows
            ]

        # services = [
        #     [dict(zip(columns, row)) for row in rows]
        # ]
        serrilizer = ServiceSerializer(services,many=True)
        return Response(serrilizer.data)

class Service1View(APIView):
    def get(self, request):
        rows = Service.objects.all()
        serializer = ServiceSerializer(rows, many=True)
        return Response(serializer.data)

class ServiceDetailsView(APIView):
    def get(self, request):
        rows = ServiceDetails.objects.all()
        serializer = ServiceDetailsSerializer(rows, many=True)
        return Response(serializer.data)
    
class RevenueVillageView(APIView):
    def get(self, request):
        rows = RevenueVillageDetails.objects.all()
        serializer = RevenueVillageSerializer(rows, many=True)
        return Response(serializer.data)
    
class DistrictViewSet(viewsets.ModelViewSet):
    queryset = DistrictDetails.objects.all()
    serializer_class = DistrictSerializer

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequestDetails.objects.all()
    serializer_class = ServiceRequestSerializer

class HomePageViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Allow anyone to access
    queryset = HomePageDetails.objects.all()
    serializer_class = HomepageSerializer

class SocialMediaViewSet(viewsets.ModelViewSet):
    queryset = SocialMediaDetails.objects.all()
    serializer_class = SocialMediaSerializer

class ContactsViewSet(viewsets.ModelViewSet):
    queryset = ContactDetails.objects.all()
    serializer_class = ContactSerializer