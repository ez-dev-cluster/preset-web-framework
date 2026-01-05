from django.urls import path
from .views import HelloAPI,TablesAPI

urlpatterns = [
    path("hello/",HelloAPI.as_view()),
    path("Tables/",TablesAPI.as_view())
    ]

