from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.persons.models import Person
from api.persons.serializers import (
    DocumentAnalyzeSerializer,
    ImageUploadSerializer,
    PersonSerializer,
)
from api.persons.services.recognition_service import RecognitionService


class PersonListApiView(generics.ListCreateAPIView):
    permission_classes = ()
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class DocumentAnalyzeApiView(generics.CreateAPIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (MultiPartParser,)
    serializer_class = ImageUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        image = serializer.validated_data["image"]

        image_bytes = image.read()

        person = RecognitionService.read_document(image_bytes)

        if person:
            serializer = DocumentAnalyzeSerializer(person)
            response_data = serializer.data

            return Response(response_data, status=status.HTTP_201_CREATED)
