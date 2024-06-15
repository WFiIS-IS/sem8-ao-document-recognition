from rest_framework import serializers

from api.persons.models import Person


class PersonSerializer(serializers.ModelSerializer):
    # face_vector = serializers.ListField(
    #     child=serializers.FloatField(),
    #     allow_empty=True,
    #     min_length=128,
    #     max_length=128,
    #     write_only=True,
    #     required=False,
    #     allow_null=True,
    # )

    class Meta:
        model = Person
        fields = ["pesel", "first_name", "last_name", "face_vector"]

        extra_kwargs = {
            "face_vector": {"write_only": True},
        }

    # def create(self, validated_data):
    #     fv = validated_data.pop("face_vector")
    #     person = Person.objects.create(**validated_data)

    #     if fv:
    #         print("ollala", fv)
    #         fv = FaceVector.objects.create(person=person, face_vector=fv)

    #     return person


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField(allow_empty_file=False, use_url=False)


class DocumentAnalyzeSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    pesel = serializers.CharField()
    face_vector = serializers.ListField(child=serializers.FloatField(), allow_empty=True)
