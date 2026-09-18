from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from appointments.models import Appointment
from services.models import Service


class AppointmentTests(APITestCase):
    def setUp(self):
        self.service = Service.objects.create(
            name='Haircut',
            price=Decimal('500.00'),
            duration=30
        )
        self.appointment_data = {
            'customer_name': 'Ram Sharma',
            'customer_phone': '9800000000',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '10:00:00',
            'notes': 'Short haircut',
            'status': 'Pending'
        }
        self.appointment = Appointment.objects.create(
            customer_name='Ram Sharma',
            customer_phone='9800000000',
            service=self.service,
            appointment_date='2026-09-18',
            appointment_time='10:00:00',
            notes='Short haircut',
            status=Appointment.StatusChoices.PENDING
        )
        self.list_url = reverse('appointment-list')
        self.detail_url = reverse('appointment-detail', kwargs={'pk': self.appointment.pk})
        self.status_url = reverse('appointment-update-status', kwargs={'pk': self.appointment.pk})

    def test_list_appointments(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['customer_name'], 'Ram Sharma')
        self.assertEqual(response.data[0]['service_name'], 'Haircut')

    def test_create_appointment_success(self):
        payload = {
            'customer_name': 'Sita Thapa',
            'customer_phone': '9811111111',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '11:00:00',
            'notes': 'Layers',
            'status': 'Pending'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['customer_name'], 'Sita Thapa')
        self.assertEqual(response.data['service_name'], 'Haircut')
        self.assertEqual(response.data['service'], self.service.id)

    def test_retrieve_appointment(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_name'], 'Ram Sharma')
        self.assertEqual(response.data['service_name'], 'Haircut')

    def test_update_appointment(self):
        payload = {
            'customer_name': 'Ram Sharma Updated',
            'customer_phone': '9800000000',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '10:00:00',
            'notes': 'Updated notes',
            'status': 'Pending'
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_name'], 'Ram Sharma Updated')

    def test_delete_appointment(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Appointment.objects.filter(pk=self.appointment.pk).exists())

    def test_invalid_service(self):
        payload = {
            'customer_name': 'Hari KC',
            'customer_phone': '9822222222',
            'service': 9999,
            'appointment_date': '2026-09-18',
            'appointment_time': '12:00:00',
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('service', response.data)

    def test_missing_customer_name(self):
        payload = {
            'customer_name': '   ',
            'customer_phone': '9822222222',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '12:00:00',
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('customer_name', response.data)

    def test_missing_customer_phone(self):
        payload = {
            'customer_name': 'Hari KC',
            'customer_phone': '   ',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '12:00:00',
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('customer_phone', response.data)

    def test_duplicate_appointment_conflict(self):
        payload = {
            'customer_name': 'Duplicate Person',
            'customer_phone': '9899999999',
            'service': self.service.id,
            'appointment_date': '2026-09-18',
            'appointment_time': '10:00:00',
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(
            response.data['error'],
            "This service is already booked for the selected date and time."
        )

    def test_filter_appointments_by_status(self):
        Appointment.objects.create(
            customer_name='Confirmed Person',
            customer_phone='9844444444',
            service=self.service,
            appointment_date='2026-09-19',
            appointment_time='10:00:00',
            status=Appointment.StatusChoices.CONFIRMED
        )
        response = self.client.get(f"{self.list_url}?status=Confirmed")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['customer_name'], 'Confirmed Person')

    def test_protect_service_deletion_when_referenced(self):
        service_detail_url = reverse('service-detail', kwargs={'pk': self.service.pk})
        response = self.client.delete(service_detail_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Service.objects.filter(pk=self.service.pk).exists())


class AppointmentStatusTransitionTests(APITestCase):
    def setUp(self):
        self.service = Service.objects.create(
            name='Facial',
            price=Decimal('1500.00'),
            duration=60
        )
        self.appointment = Appointment.objects.create(
            customer_name='Gita Rai',
            customer_phone='9833333333',
            service=self.service,
            appointment_date='2026-09-20',
            appointment_time='14:00:00',
            status=Appointment.StatusChoices.PENDING
        )
        self.status_url = reverse('appointment-update-status', kwargs={'pk': self.appointment.pk})

    def test_valid_transition_pending_to_confirmed(self):
        response = self.client.patch(self.status_url, {'status': 'Confirmed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Confirmed')
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'Confirmed')

    def test_valid_transition_pending_to_cancelled(self):
        response = self.client.patch(self.status_url, {'status': 'Cancelled'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Cancelled')
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'Cancelled')

    def test_valid_transition_confirmed_to_completed(self):
        self.appointment.status = Appointment.StatusChoices.CONFIRMED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Completed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Completed')
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'Completed')

    def test_valid_transition_confirmed_to_cancelled(self):
        self.appointment.status = Appointment.StatusChoices.CONFIRMED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Cancelled'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Cancelled')
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'Cancelled')

    def test_invalid_transition_completed_to_pending(self):
        self.appointment.status = Appointment.StatusChoices.COMPLETED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Pending'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "Cannot change status from Completed to Pending.")

    def test_invalid_transition_completed_to_confirmed(self):
        self.appointment.status = Appointment.StatusChoices.COMPLETED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Confirmed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "Cannot change status from Completed to Confirmed.")

    def test_invalid_transition_cancelled_to_confirmed(self):
        self.appointment.status = Appointment.StatusChoices.CANCELLED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Confirmed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "Cannot change status from Cancelled to Confirmed.")

    def test_invalid_transition_cancelled_to_completed(self):
        self.appointment.status = Appointment.StatusChoices.CANCELLED
        self.appointment.save()

        response = self.client.patch(self.status_url, {'status': 'Completed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "Cannot change status from Cancelled to Completed.")
