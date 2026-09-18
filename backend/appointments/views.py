from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('service').all().order_by('appointment_date', 'appointment_time')
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        requested_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Appointment.StatusChoices.choices]
        if not requested_status or requested_status not in valid_statuses:
            return Response(
                {
                    "error": f"Invalid or missing status. Valid options are: {', '.join(valid_statuses)}."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        current_status = appointment.status

        allowed_transitions = {
            Appointment.StatusChoices.PENDING: [
                Appointment.StatusChoices.CONFIRMED,
                Appointment.StatusChoices.CANCELLED,
            ],
            Appointment.StatusChoices.CONFIRMED: [
                Appointment.StatusChoices.COMPLETED,
                Appointment.StatusChoices.CANCELLED,
            ],
            Appointment.StatusChoices.COMPLETED: [],
            Appointment.StatusChoices.CANCELLED: [],
        }

        if requested_status not in allowed_transitions.get(current_status, []):
            return Response(
                {
                    "error": f"Cannot change status from {current_status} to {requested_status}."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = requested_status
        appointment.save(update_fields=['status', 'updated_at'])

        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
