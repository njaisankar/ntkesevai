from rest_framework import serializers
from ntkesevai.webapi.models import ElectionConstituencyDetails, DistrictDetails, BlockDetails, TownPanchayatDetails, PanchayatDetails, RevenueVillageDetails, VillageStreetDetails

class ElectionConstituencySerializer(serializers.ModelSerializer):
    class Meta:
         model = ElectionConstituencyDetails  # Fields are defined in the model
         fields = ['id','name']

#district
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
         model = DistrictDetails  # Fields are defined in the model
         fields = ['district_id','name']

#block
class BlockSerializer(serializers.ModelSerializer):
    district_name = serializers.SerializerMethodField()
    class Meta:
        model = BlockDetails
        fields = ['block_id', 'districtDetails','district_name','name','constituency']

    def get_district_name(self, obj):
        return obj.districtDetails.name

class TownPanchayatSerializer(serializers.ModelSerializer):
    block_name = serializers.SerializerMethodField()
    class Meta:
        model = TownPanchayatDetails
        fields = ['town_panchayat_id','blockDetails','block_name','name']

    def get_block_name(self, obj):
        return obj.blockDetails.name
    
class PanchayatSerializer(serializers.ModelSerializer):
    block_name = serializers.SerializerMethodField()
    class Meta:
        model = PanchayatDetails
        fields = ['id','blockDetails','block_name','name']

    def get_block_name(self, obj):
        return obj.blockDetails.name

#In this class, fields are defined directly
class RevenueVillageSerializer(serializers.ModelSerializer):
    block_name = serializers.SerializerMethodField()
    #townpanchayat_name = serializers.SerializerMethodField()
    #panchayat_name = serializers.SerializerMethodField()
    class Meta:
        managed = False
        model = RevenueVillageDetails
        fields = '__all__' #['village_id','blockDetails','block_name', 'townPanchayatDetails', 'townpanchayat_name', 'panchayatDetails','panchayat_name','name']
        #fields = ['village_id','blockDetails','block_name', 'panchayatDetails','panchayat_name']

    def get_block_name(self, obj):
        return obj.blockDetails.name
    
    #def get_townpanchayat_name(self, obj):
    #    return obj.townPanchayatDetails.name
    
    #def get_panchayat_name(self, obj):
    #      return obj.panchayatDetails.name

class TownPanchayatVillageSerializer(serializers.ModelSerializer):
    class Meta:
        managed = False
        model = VillageStreetDetails
        fields = '__all__'
        #fields = ['id', 'ward', 'village_street_name', 'population', 'town_village_panchayat_id']