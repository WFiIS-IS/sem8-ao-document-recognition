from django.db import models
from pgvector.django import VectorField


class Person(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    id_number = models.CharField(null=True, blank=True)
    driving_license_number = models.CharField(null=True, blank=True)
    face_vector = VectorField(dimensions=1, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.first_name


# class FaceVector(models.Model):
#     uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     person = models.OneToOneField(Person, on_delete=models.CASCADE, related_name="face_vector")
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.person.first_name
