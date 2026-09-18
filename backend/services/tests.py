from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from services.models import Service


class ServiceTests(APITestCase):
    def setUp(self):
        self.service_data = {
            'name': 'Haircut',
            'price': '500.00',
            'duration': 30
        }
        self.service = Service.objects.create(
            name='Haircut',
            price=Decimal('500.00'),
            duration=30
        )
        self.list_url = reverse('service-list')
        self.detail_url = reverse('service-detail', kwargs={'pk': self.service.pk})

    def test_list_services(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Haircut')

    def test_create_service_success(self):
        payload = {
            'name': 'Facial',
            'price': '1500.00',
            'duration': 60
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Facial')
        self.assertEqual(response.data['price'], '1500.00')
        self.assertEqual(response.data['duration'], 60)

    def test_retrieve_service(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Haircut')

    def test_update_service(self):
        payload = {
            'name': 'Premium Haircut',
            'price': '700.00',
            'duration': 45
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Premium Haircut')
        self.assertEqual(response.data['price'], '700.00')
        self.assertEqual(response.data['duration'], 45)

    def test_delete_service(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Service.objects.filter(pk=self.service.pk).exists())

    def test_invalid_price_zero_or_negative(self):
        payload_zero = {
            'name': 'Free Haircut',
            'price': '0.00',
            'duration': 30
        }
        response = self.client.post(self.list_url, payload_zero, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('price', response.data)

        payload_neg = {
            'name': 'Negative Haircut',
            'price': '-100.00',
            'duration': 30
        }
        response_neg = self.client.post(self.list_url, payload_neg, format='json')
        self.assertEqual(response_neg.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('price', response_neg.data)

    def test_invalid_duration_zero_or_negative(self):
        payload_zero = {
            'name': 'Quick Trim',
            'price': '200.00',
            'duration': 0
        }
        response = self.client.post(self.list_url, payload_zero, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('duration', response.data)

    def test_empty_service_name(self):
        payload = {
            'name': '   ',
            'price': '200.00',
            'duration': 30
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
