from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at',)
