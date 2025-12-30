from django.urls import path, include

from user import views
from user.api_views import me_api

urlpatterns = [
    path("me/",me_api.UserMeAPIView.as_view()),
]