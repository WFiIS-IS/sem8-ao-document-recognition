from rest_framework import serializers

from api.persons.models import Person


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["pesel", "first_name", "last_name"]


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField(allow_empty_file=False, use_url=False)


class APersonSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    personal_number = serializers.CharField()
    date_of_birth = serializers.DateField()
