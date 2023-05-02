from django.db import models

class User(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    created_at= models.DateTimeField(auto_now_add=True)