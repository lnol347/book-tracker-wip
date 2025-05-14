from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, ReadingList

# serializer za korisnika
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data): #kreiranje korisnika
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# serializer za knjigu
class BookSerializer(serializers.ModelSerializer):
    uploaded_cover = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Book
        fields = '__all__'

# serializer za listu čitanja
class ReadingListSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    # pretvaranje liste čitanja u dict
    class Meta:
        model = ReadingList
        fields = ('id', 'book', 'status', 'date_added')

    def create(self, validated_data):
        return validated_data
