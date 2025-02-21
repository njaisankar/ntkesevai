from rest_framework import serializers
from ntkesevai.webapi.models import ServiceRequestDetails

class ServiceSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    service_name = serializers.CharField(max_length=100)

class ServiceDetailsSerializer(serializers.Serializer):
    service_details_id = serializers.IntegerField()
    service_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    #url = serializers.CharField(max_length=100)

class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'