from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from table_reserves.models import Table

# Create your views here.
class Hello(APIView):
    authentication_classes=[]
    permission_classes=[]
    def get(self, request):
        return Response("hello")

 

class Tables(APIView):
    authentication_classes=[]
    permission_classes=[]
    def get(self,request):
        arr = []
        tables=Table.objects.all()
        for i in tables:
            arr.append({
                "number":i.number,
                "price":i.price_per_hour,
                "seat":i.seat
            }) 
        return Response(arr)