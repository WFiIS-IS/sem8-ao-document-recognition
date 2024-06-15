from django.urls import path

from api.persons.views import DocumentAnalyzeApiView, PersonListApiView

app_name = "persons"

urlpatterns = [
    path("", PersonListApiView.as_view()),
    path("analyze-document", DocumentAnalyzeApiView.as_view()),
]
