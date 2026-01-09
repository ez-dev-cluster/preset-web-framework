from django.contrib import admin
from .models import PrivateFile, PublicFile
# Register your models here.


class PrivateFileAdmin(admin.ModelAdmin):
    list_display = ("file", "folder", "created_at", "updated_at")
    list_filter = ("folder", "created_at", "updated_at")
    search_fields = ("folder", "file")
    ordering = ("-created_at",)


class PublicFileAdmin(admin.ModelAdmin):
    list_display = ("file", "folder", "created_at", "updated_at")
    list_filter = ("folder", "created_at", "updated_at")
    search_fields = ("folder", "file")
    ordering = ("-created_at",)


admin.site.register(PrivateFile, PrivateFileAdmin)
admin.site.register(PublicFile, PublicFileAdmin)
