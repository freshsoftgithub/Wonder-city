from rest_framework import serializers
from .models import User, Reserv, Card, PaymentBalance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password','name', 'cardID')

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')

class UserProfileChange(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('userID', 'email', 'name', 'phone')

class ReservSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserv
        fields = ('userID', 'email', 'name', 'phone', 'date', 'people', 'time', 'hours', 'price')


class PaymentTopUp(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('userID', 'cardID', 'balance')

class CardInfo(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('userID', 'cardID')

class TopUpBalance(serializers.ModelSerializer):
    class Meta:
        model = PaymentBalance
        fields = ('userID', 'cardID', 'topUP', 'bonus')

class ConfirmEmail(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('userID', 'approveCode')
