from django.urls import path
from .views import Hello,Tables


urlpatterns = [
    path('hello/', Hello.as_view()),
    path('tables/', Tables.as_view())
]