from django.db import connection
# Create your views here.

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import routers
from ntkesevai.webapi.services.master.serializers import DistrictSerializer, RevenueVillageSerializer
from ntkesevai.webapi.models import RevenueVillageDetails, DistrictDetails

import logging

logger = logging.getLogger(__name__)

class DistrictViewSet(viewsets.ModelViewSet):
    queryset = DistrictDetails.objects.all()
    serializer_class = DistrictSerializer

#Block
   
class RevenueVillageView(APIView):
    def get(self, request):
        rows = RevenueVillageDetails.objects.all()
        serializer = RevenueVillageSerializer(rows, many=True)
        return Response(serializer.data)
    
router = routers.DefaultRouter()
router.register('DistrictDetails', DistrictViewSet, basename='api')
urlPatterns = router.urls