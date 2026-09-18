from django.db import models
from services.models import Service


class Appointment(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        CONFIRMED = 'Confirmed', 'Confirmed'
        COMPLETED = 'Completed', 'Completed'
        CANCELLED = 'Cancelled', 'Cancelled'

    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    # on_delete=models.PROTECT prevents deleting a service that is already referenced by appointments
    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='appointments',
        help_text="PROTECT prevents deleting a service that is already referenced by appointments."
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    notes = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['appointment_date', 'appointment_time']
        constraints = [
            models.UniqueConstraint(
                fields=['service', 'appointment_date', 'appointment_time'],
                name='unique_service_appointment_time'
            )
        ]

    def __str__(self):
        return f"{self.customer_name} - {self.service.name} ({self.appointment_date} {self.appointment_time}) [{self.status}]"
