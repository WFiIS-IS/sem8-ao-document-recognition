import os
from dataclasses import dataclass
from datetime import date, datetime

import boto3
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, AnalyzeResult
from azure.core.credentials import AzureKeyCredential
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.persons.models import Person
from api.persons.serializers import (
    APersonSerializer,
    ImageUploadSerializer,
    PersonSerializer,
)


class PersonListApiView(generics.ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class PersonCreateApiView(generics.CreateAPIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (MultiPartParser,)
    serializer_class = ImageUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        image = serializer.validated_data["image"]

        image_bytes = image.read()

        analysis_result = read_document_data(image_bytes)
        person = parse_document_data(analysis_result)

        if person:
            serializer = APersonSerializer(person)
            response_data = serializer.data

            return Response(response_data, status=status.HTTP_201_CREATED)

        cc = boto3.client("textract", region_name="eu-west-1")

        response = cc.analyze_document(
            Document={"Bytes": image_bytes},
            FeatureTypes=["LAYOUT", "QUERIES"],
            QueriesConfig={
                "Queries": [
                    {"Text": "What is the document title?"},
                    {"Text": "What is the person surname?"},
                    {"Text": "What is the person PESEL?"},
                ]
            },
        )

        queries = [block for block in response["Blocks"] if block["BlockType"].startswith("QUERY")]

        questions = [query["Query"]["Text"] for query in queries if query["BlockType"] == "QUERY"]
        answers = [query["Text"] for query in queries if query["BlockType"] == "QUERY_RESULT"]

        return Response({"message": zip(questions, answers)}, status=status.HTTP_201_CREATED)


# this very temp, just to make sure everything works, you can upload any supported document format. Basiccally need to add recognition :)
@dataclass
class Person:
    """Simple person entity"""

    first_name: str
    last_name: str
    personal_number: str
    date_of_birth: date


def read_document_data(image: bytes) -> AnalyzeResult:
    """Read and analyze document data with Azure Document Intelligence

    Args:
        image (bytes): image data

    Returns:
        AnalyzeResult: analysis result
    """
    subscription_key = os.environ["AZURE_VISION_KEY"]
    endpoint = os.environ["AZURE_VISION_ENDPOINT"]

    # initialize DI client
    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(subscription_key)
    )

    # perform & get analysis results
    poller = document_intelligence_client.begin_analyze_document(
        "prebuilt-idDocument", AnalyzeDocumentRequest(bytes_source=image)
    )

    result: AnalyzeResult = poller.result()

    return result


def parse_document_data(analysis_result: AnalyzeResult) -> Person:
    """Get data from the AnalyzeResult and parse it to Person entity

    Args:
        analysis_result (AnalyzeResult): DI analysis result

    Returns:
        Person: human identification data
    """
    for doc in analysis_result.documents:
        match doc.doc_type:
            case "idDocument.nationalIdentityCard":
                date_of_birth = datetime.strptime(doc.fields["DateOfBirth"].content, "%d.%m.%Y").date()
                personal_number = doc.fields["DocumentNumber"].content
                first_name = doc.fields["FirstName"].content
                last_name = doc.fields["LastName"].content
                return Person(
                    first_name=first_name,
                    last_name=last_name,
                    personal_number=personal_number,
                    date_of_birth=date_of_birth,
                )
            case "idDocument.driverLicense":
                date_of_birth = datetime.strptime(doc.fields["DateOfBirth"].content, "%d.%m.%Y").date()
                personal_number = doc.fields["PersonalNumber"].content
                first_name = doc.fields["FirstName"].content
                last_name = doc.fields["LastName"].content
                return Person(
                    first_name=first_name,
                    last_name=last_name,
                    personal_number=personal_number,
                    date_of_birth=date_of_birth,
                )
            case "idDocument":
                pass
