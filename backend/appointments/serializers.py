from rest_framework import serializers
from services.models import Service
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        error_messages={
            'required': 'Service is required.',
            'does_not_exist': 'Selected service does not exist.',
            'incorrect_type': 'Invalid service ID format.'
        }
    )
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'customer_name',
            'customer_phone',
            'service',
            'service_name',
            'appointment_date',
            'appointment_time',
            'notes',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'service_name', 'created_at', 'updated_at']
        validators = []  # Clear default unique constraint validator to use custom validate() error format

    def validate_customer_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Customer name is required and cannot be empty.")
        return value.strip()

    def validate_customer_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Customer phone is required and cannot be empty.")
        return value.strip()

    def validate(self, attrs):
        service = attrs.get('service', getattr(self.instance, 'service', None))
        appointment_date = attrs.get('appointment_date', getattr(self.instance, 'appointment_date', None))
        appointment_time = attrs.get('appointment_time', getattr(self.instance, 'appointment_time', None))

        if service and appointment_date and appointment_time:
            conflict_qs = Appointment.objects.filter(
                service=service,
                appointment_date=appointment_date,
                appointment_time=appointment_time
            )
            if self.instance and self.instance.pk:
                conflict_qs = conflict_qs.exclude(pk=self.instance.pk)

            if conflict_qs.exists():
                raise serializers.ValidationError(
                    {"error": "This service is already booked for the selected date and time."}
                )

        return attrs
