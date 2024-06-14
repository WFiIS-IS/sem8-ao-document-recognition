from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.persons.models import Person
from api.persons.serializers import ImageUploadSerializer, PersonSerializer

# Create your views here.


class PersonListApiView(generics.ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


# allow user to send images, but do not store them, they need to be just processed before save


class PersonCreateApiView(generics.CreateAPIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (MultiPartParser,)
    serializer_class = ImageUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # image = serializer.validated_data["image"]

        return Response({"message": "Image uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
