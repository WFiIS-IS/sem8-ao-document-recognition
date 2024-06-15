from django.urls import path

from api.persons.views import PersonCreateApiView, PersonListApiView

app_name = "persons"

urlpatterns = [
    path("", PersonListApiView.as_view()),
    path("analyze-document", PersonCreateApiView.as_view()),
]
