from decimal import Decimal
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=150)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'), message="Price must be greater than zero.")]
    )
    duration = models.PositiveIntegerField(
        validators=[MinValueValidator(1, message="Duration must be greater than zero.")],
        help_text="Duration in minutes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def clean(self):
        super().clean()
        if not self.name or not self.name.strip():
            raise ValidationError({'name': 'Service name cannot be empty.'})
        if self.price is not None and self.price <= Decimal('0.00'):
            raise ValidationError({'price': 'Price must be greater than zero.'})
        if self.duration is not None and self.duration <= 0:
            raise ValidationError({'duration': 'Duration must be greater than zero.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (NPR {self.price})"
