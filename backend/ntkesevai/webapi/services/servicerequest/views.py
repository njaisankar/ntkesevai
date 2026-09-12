# from django.shortcuts import render
from django.db import connection
# Create your views here.

from rest_framework import viewsets, routers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.decorators import action
from django.http import FileResponse

from rest_framework.pagination import PageNumberPagination

from ntkesevai.webapi.services.utils.receipt_certificate import generate_certificate as create_certificate_file

from ntkesevai.webapi.models import Service, ServiceDetails, ServiceLinks, ServiceRequestDetails
from ntkesevai.webapi.services.servicerequest.serializers import ServiceSerializer, ServiceDetailsSerializer, ServiceRequestSerializer,ServiceRequestWriteSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import logging
from rest_framework.renderers import JSONRenderer
from ntkesevai.webapi.renderers import JPEGRenderer

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

#Called while update record submit button clicked
class ServiceRequestForEditRecordView(APIView):
      def get(self, request):
        queryset = ServiceRequestDetails.objects.all().filter(id = self.request.query_params.get('id'));
        print('Edit record ', queryset)
        serializer = ServiceRequestSerializer(queryset, many=True)
        print('Edit record serializer data', serializer.data)
        return Response(serializer.data)
            
class ServiceRequestViewSet(viewsets.ModelViewSet):
    # Add JPEGRenderer to the list
    renderer_classes = [JSONRenderer, JPEGRenderer]

    queryset = ServiceRequestDetails.objects.all()
    serializer_class = ServiceRequestSerializer
    pagination_class = CustomPagination
    # 💡 This is the critical line you are missing.
    # It tells the viewset to accept both multipart and form data for all methods.
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        print('action ', self.action)
        """
        Return the appropriate serializer class for the current action.
        """
        if self.action in ['create', 'update', 'partial_update']:
            # Use the simple serializer that accepts the IDs
            return ServiceRequestWriteSerializer

        # Use the nested serializer for list and retrieve (read operations)
        return ServiceRequestSerializer

    def get_queryset(self):
        user = self.request.user

        print('get method user details ', user)
        queryset = super().get_queryset()
        # 1. Role-Based Visibility Filter (Standard Procedure 2026)
        is_approver = user.groups.filter(name='Approvers_Group').exists()

        if not (user.is_superuser or is_approver):
            print('super or approver exists')
            # If user is only a 'Creator', show only their own records
            # Replace 'created_by' with your actual field name linked to User
            queryset = queryset.filter(created_by=user.email)

        queryset = self.filter_queryset(queryset)
        serviceId = self.request.query_params.get('serviceid')
        recordId = self.request.query_params.get('id')
        print('Service Id =>', serviceId)
        if serviceId:
            queryset = queryset.filter(service_id=serviceId);
        elif recordId:
              queryset = queryset.filter(id=recordId);
              print('Record Id =>', recordId)
        else:
            print('No Service Id or Record Id filter applied')

        return queryset.select_related('service_details','district','block','town_panchayat','panchayat', 'village_street' )
    
    def list(self, request, *args, **kwargs):
        user = request.user
        print('list method - user ', user)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset.select_related('service_details','district','block','town_panchayat','panchayat', 'village_street' ))
        if(page is not None):
            ServiceRequestSerializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(ServiceRequestSerializer.data)

        ServiceRequestSerializer = self.get_serializer(queryset.select_related('service_details','district','block','town_panchayat','panchayat', 'village_street'  ), many = True)
        return Response(ServiceRequestSerializer.data)

    # 💡 OVERRIDE THE CREATE METHOD FOR DEBUGGING
    def create(self, request, *args, **kwargs):
        # 1. Print Raw Data (for debugging form data/upload issues)
        print("--- DEBUGGING CREATE REQUEST ---")
        print("ACTION:", self.action)
        print("INCOMING REQUEST DATA:")
        # Use .data to access parsed data (including form data and uploaded files)
        print(request.data)
        print("---------------------------------")

        # Get the correct serializer (should be ServiceRequestWriteSerializer)
        serializer = self.get_serializer(data=request.data)

        # 2. Validate Data and Print Errors
        if not serializer.is_valid():
            print("!!! SERIALIZER ERRORS !!!")
            # This is the key to finding what's missing or invalid!
            print(serializer.errors)
            print("!!! END SERIALIZER ERRORS !!!")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 3. If valid, proceed with creation (default ModelViewSet logic)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        # 1. Get the instance to update
        partial = kwargs.pop('partial', False)
        instance = self.get_object()  # This fetches the record with ID 100

        print("--- DEBUGGING UPDATE REQUEST ---")
        print("ACTION:", self.action)
        print("INSTANCE ID:", instance.pk)
        print("INCOMING REQUEST DATA:")
        print(request.data)
        print("---------------------------------")

        # 2. Get the correct serializer (ServiceRequestWriteSerializer) and pass data/instance
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        # 3. Validate Data and Print Errors (THE CRITICAL STEP)
        if not serializer.is_valid():
            print("!!! SERIALIZER ERRORS !!!")
            print(serializer.errors)  # ⬅️ This will show you exactly why it's not saving!
            print("!!! END SERIALIZER ERRORS !!!")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 4. If valid, proceed with update
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been used, we need to refresh the instance
            instance = self.get_object()

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def generate_certificate(self, request, pk=None):
        try:
            service_request = self.get_object()
            file_path = create_certificate_file(service_request)
            print(f'generated certificate file {file_path}')
            if not file_path:
                return HttpResponse("Certificate generation failed.", status=500)

            with open(file_path, 'rb') as f:
                return HttpResponse(f.read(), content_type="image/jpeg")

        except Exception as e:
            print(f"CRITICAL ERROR: {e}") # This will show in your terminal
            return JsonResponse({'error': str(e)}, status=500)
router = routers.DefaultRouter()
router.register(r'servicerequestdetails', ServiceRequestViewSet, basename='servicerequest')
urlPatterns = router.urls