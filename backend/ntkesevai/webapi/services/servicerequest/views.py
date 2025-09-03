# from django.shortcuts import render
from django.db import connection
# Create your views here.

from rest_framework import viewsets, routers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.decorators import action
from django.http import FileResponse

from rest_framework.pagination import PageNumberPagination

from ntkesevai.webapi.services.utils.receipt_certificate import generate_certificate

from ntkesevai.webapi.models import Service, ServiceDetails, ServiceLinks, ServiceRequestDetails
from ntkesevai.webapi.services.servicerequest.serializers import ServiceSerializer, ServiceDetailsSerializer, ServiceRequestSerializer
from rest_framework.parsers import MultiPartParser, FormParser
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
        serializer = ServiceSerializer(services,many=True)
        return Response(serializer.data)

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
    print('edit ', queryset)
    serializer_class = ServiceRequestSerializer
    pagination_class = CustomPagination
    # 💡 This is the critical line you are missing.
    # It tells the viewset to accept both multipart and form data for all methods.
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset()
        #queryset = queryset.filter(id = self.request.query_params.get('id'));
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset=self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if(page is not None):
            ServiceRequestSerializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(ServiceRequestSerializer.data)
        
        ServiceRequestSerializer = self.get_serializer(queryset, many = True)
        return Response(ServiceRequestSerializer.data)

    @action(detail=True, methods=['get'])
    def generate_certificate(self, request, pk=None):
        service_request = self.get_object()
        file_path = generate_certificate(service_request)
        if not file_path:
            return HttpResponse("Certificate generation failed.", status=500)

        with open(file_path, 'rb') as f:
            image_data = f.read()

            # Return the HttpResponse with the correct content type
        response = HttpResponse(image_data, content_type="image/jpeg")
        # Optional: Force a download with a filename
        # response['Content-Disposition'] = 'attachment; filename="certificate.jpg"'
        return response
        #return FileResponse(open(file_path, 'rb'), content_type='image/jpeg')

router = routers.DefaultRouter()
router.register(r'servicerequestdetails', ServiceRequestViewSet, basename='servicerequest')
urlPatterns = router.urls