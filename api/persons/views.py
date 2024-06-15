from django.db.models import F
from django.db.models.functions import Sqrt
from pgvector.django import L2Distance
from rest_framework import generics, status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.persons.models import Person
from api.persons.serializers import (
    DocumentAnalyzeSerializer,
    ImageUploadSerializer,
    PersonLookupSerializer,
    PersonSerializer,
)
from api.persons.services.recognition_service import RecognitionService


class PersonView(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class PersonLookupView(generics.GenericAPIView):
    throttle_classes = ()
    permission_classes = ()
    serializer_class = PersonLookupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        face_vector = serializer.validated_data["face_vector"]

        persons = Person.objects.annotate(distance=Sqrt(L2Distance(F("face_vector"), face_vector))).filter(
            distance__lt=0.6
        )

        print(persons)

        serializer = PersonSerializer(persons, many=True)
        response_data = serializer.data

        return Response(response_data, status=status.HTTP_201_CREATED)


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
