from django.db import connection
# Create your views here.

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import routers
from ntkesevai.webapi.services.master.serializers import DistrictSerializer, BlockSerializer, TownPanchayatSerializer, PanchayatSerializer, RevenueVillageSerializer, TownPanchayatVillageSerializer
from ntkesevai.webapi.models import DistrictDetails, BlockDetails, TownPanchayatDetails, PanchayatDetails, RevenueVillageDetails, VillageStreetDetails

import logging

logger = logging.getLogger(__name__)

class DistrictViewSet(viewsets.ModelViewSet):
    queryset = DistrictDetails.objects.all()
    serializer_class = DistrictSerializer

class BlockView(APIView):
    def get(self, request):
        rows = BlockDetails.objects.all()
        serializer = BlockSerializer(rows, many=True)
        return Response(serializer.data)

class TownPanchayatView(APIView):
    def get(self, request):
        rows = TownPanchayatDetails.objects.all()
        serializer = TownPanchayatSerializer(rows, many=True)
        return Response(serializer.data)

class PanchayatView(APIView):
    def get(self, request):
        rows = PanchayatDetails.objects.all()
        serializer = PanchayatSerializer(rows, many=True)
        return Response(serializer.data)
        
class RevenueVillageView(APIView):
    def get(self, request):
        rows = RevenueVillageDetails.objects.all()
        serializer = RevenueVillageSerializer(rows, many=True)
        return Response(serializer.data)

class VillageStreetView(APIView):
    def get(self, request):
        rows = VillageStreetDetails.objects.all()
        serializer = TownPanchayatVillageSerializer(rows, many=True)
        return Response(serializer.data)
    
router = routers.DefaultRouter()
router.register('DistrictDetails', DistrictViewSet, basename='api')
urlPatterns = router.urls