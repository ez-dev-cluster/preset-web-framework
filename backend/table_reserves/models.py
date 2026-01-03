from django.db import models

class Table(models.Model):
    number = models.CharField(max_length=100)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    seat = models.IntegerField()
    description = models.TextField()
    location_x = models.DecimalField(max_digits=10, decimal_places=2)
    location_y = models.DecimalField(max_digits=10, decimal_places=2)
    width = models.DecimalField(max_digits=10, decimal_places=2)
    length = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None)

