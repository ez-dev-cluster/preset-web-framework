from django.db import models

# Create your models here.
from protected_media.models import ProtectedFileField


def private_upload_to(instance, filename):
    return f"{instance.folder}/{filename}"


class PrivateFile(models.Model):
    folder = models.CharField(max_length=255)
    file = ProtectedFileField(upload_to=private_upload_to)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.file.name


def public_upload_to(instance, filename):
    return f"{instance.folder}/{filename}"


class PublicFile(models.Model):
    folder = models.CharField(max_length=255)
    file = models.FileField(upload_to=public_upload_to)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.file.name
