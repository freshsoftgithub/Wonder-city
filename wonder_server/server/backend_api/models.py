from django.db import models

class User(models.Model):
    userID = models.IntegerField()
    email = models.EmailField()
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    cardID = models.CharField(max_length=20)
    approveCode = models.CharField(max_length=6)
    approve = models.BooleanField()

class Reserv(models.Model):
    userID = models.IntegerField()
    email = models.EmailField()
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    date = models.DateField()
    people = models.IntegerField()
    time = models.CharField(max_length=20)
    hours = models.IntegerField()
    price = models.FloatField()

class Card(models.Model):
    userID = models.IntegerField()
    cardID = models.CharField(max_length=20)
    balance = models.IntegerField()

class PaymentBalance(models.Model):
    userID = models.IntegerField()
    cardID = models.CharField(max_length=20)
    topUP = models.FloatField()
    bonus = models.IntegerField()
    orderID = models.CharField(max_length=200)
    approve = models.BooleanField()
