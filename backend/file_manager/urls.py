from file_manager.api_views import UploadPrivateFileAPIView
from django.urls import path
from .api_views import UploadPublicFileAPIView

urlpatterns = [
    path("upload/public-file/", UploadPublicFileAPIView.as_view()),
    path("upload/private-file/", UploadPrivateFileAPIView.as_view()),
]
