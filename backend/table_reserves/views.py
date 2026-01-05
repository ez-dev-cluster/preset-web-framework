from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from table_reserves.models import Table


class HelloAPI(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response("hello world!")
    
class TablesAPI(APIView):
    authentication_classes = []
    permission_classes = []
    def get(self, request):
        tables = []
        table = Table.objects.all()
        for i in table:
            tables.append({
                'Number':i.number,
                'Price':i.price_per_hour,
                'seat': i.seat
            })
        return Response(tables)