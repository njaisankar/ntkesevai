from django.contrib.auth.models import Group, User
from rest_framework import serializers
from ntkesevai.webapi.models import HomePageDetails, SocialMediaDetails, ContactDetails

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