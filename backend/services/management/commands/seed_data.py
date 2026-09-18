from decimal import Decimal
from django.core.management.base import BaseCommand
from services.models import Service


class Command(BaseCommand):
    help = 'Seed initial salon services without creating duplicates.'

    def handle(self, *args, **options):
        initial_services = [
            {
                'name': 'Haircut',
                'price': Decimal('500.00'),
                'duration': 30,
            },
            {
                'name': 'Hair Coloring',
                'price': Decimal('2500.00'),
                'duration': 120,
            },
            {
                'name': 'Facial',
                'price': Decimal('1500.00'),
                'duration': 60,
            },
        ]

        created_count = 0
        for svc_data in initial_services:
            service, created = Service.objects.get_or_create(
                name=svc_data['name'],
                defaults={
                    'price': svc_data['price'],
                    'duration': svc_data['duration'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created service: {service.name} (NPR {service.price}, {service.duration} mins)")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"Service already exists: {service.name}")
                )

        self.stdout.write(
            self.style.SUCCESS(f"Seeding completed. {created_count} new service(s) created.")
        )
