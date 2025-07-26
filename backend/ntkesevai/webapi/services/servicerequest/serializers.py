from rest_framework import serializers
from ntkesevai.webapi.models import Service,ServiceDetails, ServiceLinks, ServiceRequestDetails

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
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'

class ServiceRequestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequestDetails
        fields = '__all__'