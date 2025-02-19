from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import DistrictDetails, ServiceRequestDetails, HomePageDetails, SocialMediaDetails, ContactDetails

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ServiceSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    service_name = serializers.CharField(max_length=100)

class ServiceDetailsSerializer(serializers.Serializer):
    service_details_id = serializers.IntegerField()
    service_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    #url = serializers.CharField(max_length=100)

class RevenueVillageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    block_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
         model = DistrictDetails
         fields = ['district_id','name']

class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'

class HomepageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePageDetails
        fields = '__all__'

class SocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaDetails
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetails
        fields = '__all__'