# from django.shortcuts import render
from django.db import connection
# Create your views here.

from rest_framework import viewsets, routers
from rest_framework.views import APIView
from rest_framework.response import Response

from ntkesevai.webapi.models import Service, ServiceDetails, ServiceRequestDetails
from ntkesevai.webapi.services.servicerequest.serializers import ServiceSerializer, ServiceDetailsSerializer, ServiceRequestSerializer

import logging

logger = logging.getLogger(__name__)

class ServiceWithMappingView(APIView):
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

class ServiceWithoutMappingView(APIView):
    def get(self, request):
        rows = Service.objects.all()
        serializer = ServiceSerializer(rows, many=True)
        return Response(serializer.data)

class ServiceDetailsView(APIView):
    def get(self, request):
        rows = ServiceDetails.objects.all()
        serializer = ServiceDetailsSerializer(rows, many=True)
        return Response(serializer.data)
    
class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequestDetails.objects.all()
    serializer_class = ServiceRequestSerializer


router = routers.DefaultRouter()
router.register(r'ServiceRequestDetails', ServiceRequestViewSet, basename='servicerequest')
urlPatterns = router.urls