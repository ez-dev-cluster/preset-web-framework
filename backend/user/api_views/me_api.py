from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers

from user.models import User


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name','is_staff')

class UserMeAPIView(APIView):
    def get(self,request):
        out = UserMeSerializer(request.user).data
        return Response(out)