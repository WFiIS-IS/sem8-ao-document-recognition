from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.persons.views import DocumentAnalyzeApiView, PersonLookupView, PersonView

app_name = "persons"

router = DefaultRouter()
router.register("", PersonView)

urlpatterns = [
    path("", include(router.urls)),
    path("analyze-document", DocumentAnalyzeApiView.as_view()),
    path("lookup", PersonLookupView.as_view()),
]
