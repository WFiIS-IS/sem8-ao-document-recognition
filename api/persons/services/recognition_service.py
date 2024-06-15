import os
from dataclasses import dataclass

import boto3
import cv2
import face_recognition
import numpy as np
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, AnalyzeResult
from azure.core.credentials import AzureKeyCredential


# this very temp, just to make sure everything works, you can upload any supported document format. Basiccally need to add recognition :)
@dataclass
class Person:
    """Simple person entity"""

    first_name: str
    last_name: str
    pesel: str
    face_vector: list = None  # 128 item face vector


class RecognitionService:
    @staticmethod
    def read_document(image: bytes) -> Person:
        image = RecognitionService.__trim_image(image)

        face_vector = RecognitionService.__get_face(image)

        person = RecognitionService.__read_document_data_azure(image)

        if person is None:
            person = RecognitionService.__read_document_data_aws(image)

        if person is None:
            person = Person(first_name=None, last_name=None, pesel=None)

        person.face_vector = face_vector

        return person

    @staticmethod
    def __trim_image(image: bytes) -> bytes:
        """
        Trim image if one of the image dimensions is greater than 1000px

        Args:
            image (bytes): image data

        Returns:
            bytes: trimmed image data
        """

        im = RecognitionService.__bytes2cv2(image)
        height, width, _ = im.shape

        if not (width > 1000 or height > 1000):
            return image

        client = boto3.client("rekognition", region_name="eu-west-1")

        response = client.detect_labels(Image={"Bytes": image})

        labels = [label for label in response["Labels"] if label["Name"] == "Driving License"]
        label = labels[0] if labels else None

        if label:
            box = label["Instances"][0]["BoundingBox"]

            # calculate bounding box coordinates
            left = box["Left"] * width
            right = left + box["Width"] * width
            bottom = box["Top"] * height
            top = bottom + box["Height"] * height

            # crop image with cv2
            im = im[int(bottom) : int(top), int(left) : int(right), :]

            image_bytes = cv2.imencode(".jpg", im)[1].tostring()
            return image_bytes

    @staticmethod
    def __read_document_data_aws(image: bytes) -> Person:
        """Read and analyze document with AWS Textract
        This method is used for els only. It also cuts the image to remove header of the document

        Args:
            image (bytes): image data

        Returns:
            Person: human identification data
        """

        image = RecognitionService.__bytes2cv2(image)
        height, _, _ = image.shape
        image = image[int(height * 0.3) :, :]

        image_bytes = cv2.imencode(".jpg", image)[1].tostring()

        client = boto3.client("textract", region_name="eu-west-1")

        response = client.analyze_document(
            Document={"Bytes": image_bytes},
            FeatureTypes=["LAYOUT", "QUERIES"],
            QueriesConfig={
                "Queries": [
                    {"Text": "what is the name of the person written in the center?"},
                    {"Text": "What is the person PESEL?"},
                ]
            },
        )

        queries = [block for block in response["Blocks"] if block["BlockType"].startswith("QUERY")]
        answers = [query["Text"] for query in queries if query["BlockType"] == "QUERY_RESULT"]

        try:
            if len(answers) == 2:
                first_name, last_name = answers[0].split()
                personal_number = answers[1][-11:]
                return Person(first_name=first_name, last_name=last_name, pesel=personal_number)
        except Exception:
            return None

    @staticmethod
    def __read_document_data_azure(image: bytes) -> Person:
        """Read and analyze document data with Azure Document Intelligence

        Args:
            image (bytes): image data

        Returns:
            Person: human identification data
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

        return RecognitionService.__parse_document_data(result)

    @staticmethod
    def __parse_document_data(analysis_result: AnalyzeResult) -> Person:
        """Get data from the AnalyzeResult and parse it to Person entity

        Args:
            analysis_result (AnalyzeResult): DI analysis result

        Returns:
            Person: human identification data
        """
        try:
            for doc in analysis_result.documents:
                match doc.doc_type:
                    case "idDocument.nationalIdentityCard":
                        # date_of_birth = datetime.strptime(doc.fields["DateOfBirth"].content, "%d.%m.%Y").date()
                        personal_number = doc.fields["DocumentNumber"].content
                        first_name = doc.fields["FirstName"].content
                        last_name = doc.fields["LastName"].content
                        return Person(first_name=first_name, last_name=last_name, pesel=personal_number[-11:])
                    case "idDocument.driverLicense":
                        # date_of_birth = datetime.strptime(doc.fields["DateOfBirth"].content, "%d.%m.%Y").date()
                        personal_number = doc.fields["PersonalNumber"].content
                        first_name = doc.fields["FirstName"].content
                        last_name = doc.fields["LastName"].content
                        return Person(first_name=first_name, last_name=last_name, pesel=personal_number[-11:])
                    case "idDocument":
                        pass
        except Exception:
            return None

    @staticmethod
    def __get_face(image: bytes):
        """Get face from the image

        Args:
            image (bytes): image data

        Returns:
            face vector of length 128
        """
        image = RecognitionService.__bytes2cv2(image)

        face_encodings = face_recognition.face_encodings(image)

        return face_encodings[0] if face_encodings else None

    @staticmethod
    def __bytes2cv2(image: bytes):
        """Convert image bytes to cv2 image

        Args:
            image (bytes): image data

        Returns:
            cv2 image
        """
        image = np.asarray(bytearray(image), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        return image
