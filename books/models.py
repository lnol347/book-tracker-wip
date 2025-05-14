from django.db import models
from django.contrib.auth.models import User

# model za knjigu
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    uploaded_cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    
    # funkcija za prikaz imena knjige
    def __str__(self):
        return self.title
    # funkcija za pretvaranje knjige u dict
    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "cover_image": self.cover_image
        }

# model za listu čitanja
class ReadingList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[
        ('reading', 'Trenutno čitam'),
        ('want_to_read', 'Želim pročitati'),
        ('finished', 'Pročitano')
    ])
    date_added = models.DateTimeField(auto_now_add=True)
