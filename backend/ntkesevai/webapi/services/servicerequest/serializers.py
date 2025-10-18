from rest_framework import serializers
from ntkesevai.webapi.services.master.serializers import DistrictSerializer, BlockSerializer, TownPanchayatSerializer, PanchayatSerializer, RevenueVillageSerializer, TownPanchayatVillageSerializer
from ntkesevai.webapi.models import Service,ServiceDetails, ServiceLinks, ServiceRequestDetails
from ntkesevai.webapi.models import DistrictDetails
from ntkesevai.webapi.models import BlockDetails, TownPanchayatDetails, PanchayatDetails, RevenueVillageDetails, VillageStreetDetails


class ServiceSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    service_name = serializers.CharField(max_length=100)

class ServiceDetailsSerializer(serializers.Serializer):
    service_details_id = serializers.IntegerField()
    service_id = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=100)
    url = serializers.CharField(max_length=100)
    class Meta:
        model = ServiceDetails
        fields =  '__all__'   

    def get_service_name(self, obj):
        return obj.serviceModel.service_name
    
    def get_service_id(self, obj):
        return obj.serviceModel.service_id

class ServiceLinksSerializer(serializers.Serializer):
    service_details_id = serializers.IntegerField()
    service_id = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=100)
    url = serializers.CharField(max_length=100)
    class Meta:
        model = ServiceLinks
        fields =  '__all__'   

class ServiceRequestSerializer(serializers.ModelSerializer):
    service_details = ServiceDetailsSerializer(read_only=True)
    district = DistrictSerializer(read_only=True)
    block = BlockSerializer(read_only=True)
    town_panchayat = TownPanchayatSerializer(read_only=True)
    panchayat = PanchayatSerializer(read_only=True)
    village_street = TownPanchayatVillageSerializer(read_only=True)
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'

# This serializer is for all write operations (POST/PUT/PATCH)
class ServiceRequestWriteSerializer(serializers.ModelSerializer):
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=DistrictDetails.objects.all(),
        source='district',  # Maps 'district_id' from input to model.district
        required=True
    )

    block_id = serializers.PrimaryKeyRelatedField(
        queryset=BlockDetails.objects.all(),
        source='block',  # Maps 'block_id' from input to model.block
        required=True
    )

    service_details_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceDetails.objects.all(),
        source='service_details',
        required=True
    )
    class Meta:
        model = ServiceRequestDetails
        # Include all fields, the foreign keys will automatically expect IDs
        fields = '__all__'

