from django.urls import path
from .views import (
    BookListCreate, 
    BookDetail, 
    RegisterView, 
    LoginView,
    ReadingListView,
    ReadingListDetailView,
    ImageProxyView
)
from . import views
#konfiguracija url ruta
urlpatterns = [
    path('books/', BookListCreate.as_view(), name='book-list'), #lista i kreiranje knjiga
    path('books/<int:pk>/', BookDetail.as_view(), name='book-detail'), #detalji knjige
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('reading-list/', ReadingListView.as_view(), name='reading-list'),
    path('reading-list/<int:pk>/', ReadingListDetailView.as_view(), name='reading-list-detail'),
    path('proxy-image/', ImageProxyView.as_view(), name='proxy-image'),
    path('search-books/', views.search_books, name='search-books'),
]
