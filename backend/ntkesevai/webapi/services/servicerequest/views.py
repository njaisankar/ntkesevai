# from django.shortcuts import render
from django.db import connection
# Create your views here.

from rest_framework import viewsets, routers
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.pagination import PageNumberPagination

from ntkesevai.webapi.models import Service, ServiceDetails, ServiceLinks, ServiceRequestDetails
from ntkesevai.webapi.services.servicerequest.serializers import ServiceSerializer, ServiceDetailsSerializer, ServiceRequestSerializer

import logging

logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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
        rows = ServiceDetails.objects.all().filter(serviceModel_id=self.request.query_params.get('serviceid'))
        serializer = ServiceDetailsSerializer(rows, many=True)
        return Response(serializer.data)

class ServiceLinksView(APIView):
    def get(self, request):
        rows = ServiceLinks.objects.all()
        filterRecords = rows.filter(serviceModel_id = self.request.query_params.get('serviceid'));
        serializer = ServiceDetailsSerializer(filterRecords, many=True)
        return Response(serializer.data)

class ServiceRequestForEditRecordView(APIView):
      def get(self, request):
        queryset = ServiceRequestDetails.objects.all().filter(id = self.request.query_params.get('id'));
        serializer = ServiceRequestSerializer(queryset, many=True)
        return Response(serializer.data)
            
class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequestDetails.objects.all()
    serializer_class = ServiceRequestSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(service_id = self.request.query_params.get('serviceid'));
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset=self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if(page is not None):
            ServiceRequestSerializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(ServiceRequestSerializer.data)
        
        ServiceRequestSerializer = self.get_serializer(queryset, many = True)
        return Response(ServiceRequestSerializer.data)


router = routers.DefaultRouter()
router.register(r'servicerequestdetails', ServiceRequestViewSet, basename='servicerequest')
urlPatterns = router.urls