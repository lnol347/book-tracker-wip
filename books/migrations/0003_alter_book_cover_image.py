# Generated by Django 5.0.2 on 2025-02-12 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0002_readinglist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='cover_image',
            field=models.ImageField(blank=True, null=True, upload_to='covers/'),
        ),
    ]
