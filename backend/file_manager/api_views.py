from file_manager.models import PrivateFile
from file_manager.models import PublicFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers


class UploadFileSerializer(serializers.Serializer):
    file = serializers.FileField()
    folder = serializers.CharField()


class UploadPublicFileAPIView(APIView):
    def post(self, request):
        validator = UploadFileSerializer(data=request.data)
        validator.is_valid(raise_exception=True)

        vdata = validator.validated_data
        public_file = PublicFile()
        public_file.file = vdata["file"]
        public_file.folder = vdata["folder"]
        public_file.save()

        return Response({"url": public_file.file.url})


class UploadPrivateFileAPIView(APIView):
    def post(self, request):
        validator = UploadFileSerializer(data=request.data)
        validator.is_valid(raise_exception=True)

        vdata = validator.validated_data
        private_file = PrivateFile()
        private_file.file = vdata["file"]
        private_file.folder = vdata["folder"]
        private_file.save()

        return Response({"url": private_file.file.url})
