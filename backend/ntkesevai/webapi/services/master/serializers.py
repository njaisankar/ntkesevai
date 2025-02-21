from rest_framework import serializers
from ntkesevai.webapi.models import DistrictDetails, ServiceRequestDetails, HomePageDetails, SocialMediaDetails, ContactDetails

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
         model = DistrictDetails  # Fields are defined in the model
         fields = ['district_id','name']

#block

#In this class, fields are defiend directly
class RevenueVillageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    block_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
