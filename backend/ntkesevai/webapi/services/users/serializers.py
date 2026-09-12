from django.contrib.auth.models import Group, User
from rest_framework import serializers
from ntkesevai.webapi.models.user_models import UserDetails

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['mobile','constituency_id']

class UserSerializer(serializers.ModelSerializer):
    user_details = UserDetailsSerializer(source='userdetails', read_only=True)
    user_details_data = UserDetailsSerializer(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'user_details','user_details_data']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'validators': []},
            'username': {'validators': []},
            'mobile': {'validators': []}
        }

    def validate(self, data):
        print('validate', data)
        email = data.get('email')
        user_details = data.get('user_details_data', {})
        mobile = user_details.get('mobile')
        print('validate', User)
        # 1. Check Email
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது."
            })

        # 2. Check Mobile (If mobile is in your User model)
        if mobile and UserDetails.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError({
                "mobile": "இந்த கைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது."
            })

        return data

    def create(self, validated_data):
        user_details_data = validated_data.pop('user_details_data', None)
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Set the password using set_password method
        user.is_active = False  # Set is_active to False
        user.save()
        if user_details_data:
            UserDetails.objects.create(user=user, **user_details_data)
        return user

    def update(self, instance, validated_data):
        user_details_data = validated_data.pop('user_details_data', None)
        password = validated_data.pop('password', None)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)

        if password:
            instance.set_password(password)  # Set the password using set_password method

        instance.save()

        if user_details_data:
            UserDetails.objects.update_or_create(user=instance, defaults=user_details_data)
        return instance



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8)
    
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']