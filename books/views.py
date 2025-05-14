from django.shortcuts import render
from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Book, ReadingList
from .serializers import BookSerializer, UserSerializer, ReadingListSerializer

# registracija korisnika
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request): # funkcija za kreiranje korisnika
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'token': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# login korisnika
class LoginView(generics.CreateAPIView):
    def post(self, request): # funkcija za login korisnika
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# lista čitanja
class ReadingListView(generics.ListCreateAPIView):
    serializer_class = ReadingListSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    # funkcija za dobijanje liste čitanja
    def get_queryset(self):
        return ReadingList.objects.filter(user=self.request.user)
    
    # funkcija za kreiranje knjige
    def perform_create(self, serializer):
        # Prvo kreiramo knjigu
        book = Book.objects.create(
            title=self.request.data['title'],
            author=self.request.data['author'],
            description=self.request.data.get('description', '')
        )
        
        # Ako postoji slika, dodajemo je knjizi
        if 'uploaded_cover' in self.request.FILES:
            book.uploaded_cover = self.request.FILES['uploaded_cover']
            book.save()
            
        # Kreiramo zapis u reading listi
        reading_list_item = ReadingList.objects.create(
            user=self.request.user,
            book=book,
            status=self.request.data.get('status', 'want_to_read')
        )
        
        # Vraćamo serijalizirani objekt
        return self.get_serializer(reading_list_item)

    # funkcija za kreiranje knjige
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response

# detalji liste čitanja
class ReadingListDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ReadingListSerializer
    permission_classes = [IsAuthenticated]

    # funkcija za dobivanje liste čitanja
    def get_queryset(self):
        return ReadingList.objects.filter(user=self.request.user)

# lista i kreiranje knjiga
class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = (MultiPartParser, FormParser)

    # funkcija za kreiranje knjige
    def perform_create(self, serializer):
        if 'uploaded_cover' in self.request.FILES:
            serializer.save(uploaded_cover=self.request.FILES['uploaded_cover'])
        else:
            serializer.save()

# detalji knjige
class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# za izbjegavanje googleAPI greške
class ImageProxyView(generics.GenericAPIView):
    def get(self, request):
        image_url = request.GET.get('url')
        response = requests.get(image_url)
        return HttpResponse(response.content, content_type='image/jpeg')

# pretraživanje knjiga
@api_view(['GET'])
def search_books(request):
    query = request.GET.get('q', '')
    filter_param = request.GET.get('filter', '')
    
    # Google Books API URL
    url = f'https://www.googleapis.com/books/v1/volumes?q={query}'
    if filter_param:
        url += f'+{filter_param}'
    
    try:
        response = requests.get(url)
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e)}, status=500)
