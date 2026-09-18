from django.urls import include, path
from rest_framework.routers import DefaultRouter

from appointments.views import AppointmentViewSet
from services.views import ServiceViewSet

router = DefaultRouter()

router.register(r"services", ServiceViewSet, basename="service")
router.register(r"appointments", AppointmentViewSet, basename="appointment")

urlpatterns = [
    path("api/", include(router.urls)),
]