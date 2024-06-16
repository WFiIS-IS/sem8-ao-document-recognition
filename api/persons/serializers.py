from rest_framework import serializers

from api.persons.models import Person


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
            "pesel",
            "first_name",
            "last_name",
            "date_of_birth",
            "id_number",
            "driving_license_number",
            "face_vector",
        ]

        extra_kwargs = {
            "face_vector": {"write_only": True},
        }


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField(allow_empty_file=False, use_url=False)


class PersonLookupSerializer(serializers.Serializer):
    face_vector = serializers.ListField(
        child=serializers.FloatField(),
        allow_empty=False,
        min_length=128,
        max_length=128,
        write_only=True,
        required=True,
        allow_null=False,
    )


class DocumentAnalyzeSerializer(serializers.Serializer):
    pesel = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    id_number = serializers.CharField(required=False)
    driving_license_number = serializers.CharField(required=False)
    face_vector = serializers.ListField(child=serializers.FloatField(), allow_empty=True)
