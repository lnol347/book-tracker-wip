from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Book

# testovi za model knjige
class BookModelTest(TestCase):
    # postavljanje testa
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/books/'

    def test_create_book(self):
        data = {
            "title": "Test Book",
            "author": "Test Author",
            "description": "Test description"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_books(self):
        # Prvo trebaš dodati neku knjigu
        Book.objects.create(title="Test Book", author="Test Author", description="Test description")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
