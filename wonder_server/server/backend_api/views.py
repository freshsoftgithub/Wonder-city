from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.views import View
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
import random
from .models import User, Reserv, Card
from .serializer import UserSerializer
from .serializer import UserLoginSerializer
from .serializer import UserProfileChange
from .serializer import ReservSerializer
from .serializer import PaymentBalance
from .serializer import CardInfo
from .serializer import TopUpBalance
from .serializer import ConfirmEmail
from rest_framework.response import Response
from yookassa import Configuration, Payment, Webhook
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import uuid

from .token import account_activation_token


Configuration.account_id = "321212"
Configuration.secret_key = "test_P50Lv7iDg0_sy-fDomTkX7DTVpxm-EWCG-bSNkNS2Fk"


class UserInfoView(APIView):

    def post(self, request):
        seriarlizer = UserSerializer(data=request.data)
        if(User.objects.filter(email=request.data.get('email')).exists()):
            user = User.objects.get(email=request.data.get('email'))
            if(user.approve == False):
                mail_subject = "Подтверждение аккаунта"
                message = "Код подтвеждения: " + str(user.approveCode)
                to_email = user.email
                email = EmailMessage(mail_subject, message, settings.EMAIL_HOST_USER, to=[to_email])
                email.send()
                output = [
                    {
                        "email": user.email,
                        "name": user.name,
                        "userID": user.userID,
                        "cardID": user.cardID,
                        "phone": user.phone
                    }
                ]
                return Response(output)
            return Response("Err")
        else:
            if(seriarlizer.is_valid(raise_exception=True)):
                seriarlizer.save()
                table = User.objects.get(email = request.data.get('email'))
                table.userID = table.id
                table.approve = False
                code = random.randint(100000, 999999)
                table.approveCode = code
                table.save()
                mail_subject = "Подтверждение аккаунта"
                message = "Код подтвеждения: " + str(code)
                to_email = table.email
                email = EmailMessage(mail_subject, message,settings.EMAIL_HOST_USER,to=[to_email])
                email.send()
                output = [
                    {
                        "email": table.email,
                        "name": table.name,
                        "userID": table.userID,
                        "cardID": table.cardID,
                        "phone": table.phone,
                        "approve": table.approve
                    }
                ]
                return Response(output)

    def get(self, request):
        output = [
            {
                "email": output.email,
                "password": output.password,
                "name": output.name,
            } for output in User.objects.all()
        ]
        return Response(output)


class ConfirmCode(APIView):

    def post(self,request):
        serializer = ConfirmEmail(data=request.data)
        if(serializer.is_valid(raise_exception=True)):
            user = User.objects.get(userID=request.data.get('userID'))
            if(user.approveCode == request.data.get('approveCode')):
                user.approveCode = "Confirmed"
                user.approve = True
                user.save()
                return Response('Right code')
            else:
                return Response('Wrong code')

    def get(self,request):
        output = [{
            "userID": output.userID,
            "approveCode": output.approveCode
        } for output in User.objects.all()
        ]
        return Response(output)

class UserLogin(APIView):

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            gettedEmail = request.data.get('email')
            gettedPassword = request.data.get('password')
            if (User.objects.filter(email=gettedEmail, password=gettedPassword).exists()):
                user = User.objects.get(email=gettedEmail)
                output = [{
                    "userID": user.userID,
                    "email": user.email,
                    "name": user.name,
                    "phone": user.phone,
                    "cardID": user.cardID,
                    "approve": user.approve
                }]
                if(user.approve == False):
                    mail_subject = "Подтверждение аккаунта"
                    message = "Код подтвеждения: " + str(user.approveCode)
                    to_email = user.email
                    email = EmailMessage(mail_subject, message, settings.EMAIL_HOST_USER, to=[to_email])
                    email.send()
                return Response(output)
            else:
                return Response("Err")

    def get(self, request):
        print(request)
        gettedEmail = request.data.get('email')
        gettedPassword = request.data.get('password')
        print(gettedEmail)
        output = 'Err'
        if (User.objects.filter(email=gettedEmail, password=gettedPassword).exists()):
            output = [
                {
                    "name": output.name
                } for output in User.objects.all()
            ]
        return Response(output)

class UserProfile(APIView):

    def post(self, request):
        serializer = UserProfileChange(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            user = User.objects.get(userID=request.data.get('userID'))
            user.name = request.data.get('name')
            user.phone = request.data.get('phone')
            user.save()
            output = [{
                "userID": user.userID,
                "email": user.email,
                "name": user.name,
                "phone": user.phone
            }]
            return Response(output)




    def get(self,request):
        output = [
            {
                "userID": output.id,
                "email": output.email,
                "name": output.name,
                "phone": output.phone
            } for output in User.objects.all()
        ]
        return Response(output)


class ReservRequset(APIView):
    def post(self, request):
        serializer = ReservSerializer(data=request.data)
        if(serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response(serializer.data)

    def get(self,requset):
        output = [
            {
                "userID": output.userID,
                "email": output.email,
                "name": output.name,
                "phone": output.phone,
                "date": output.date,
                'people': output.people,
                "room": output.room,
                "price": output.price
            } for output in Reserv.objects.all()
        ]
        return Response(output)


class SaveCard(APIView):
    def post(self,requset):
        serializer = CardInfo(data=requset.data)
        user = User.objects.get(userID=requset.data.get('userID'))
        if(serializer.is_valid(raise_exception=True)):
            if(Card.objects.filter(cardID = requset.data.get('cardID')).exists()):
                card = Card.objects.get(cardID = requset.data.get('cardID'))
                if(card.userID != user.userID and card.userID != None):
                    return Response("Already used")
                card.userID = requset.data.get('userID')
                user.cardID = card.cardID
                user.save()
                card.save()
                output = [
                    {
                        "cardID": card.cardID,
                        "balance": card.balance
                    }
                ]
                return Response(output)
            else:
                if(requset.data.get('cardID') == '-'):
                    if(Card.objects.filter(userID = requset.data.get('userID')).exists()):
                        card = Card.objects.get(userID=requset.data.get('userID'))
                        card.userID = None
                        card.save()
                    return Response('OK')
                return Response('Err')

    def get(self,request):
        output = [
            {
                "userID": output.userID,
                "cardID": output.cardID,
                "balance": output.balance
            } for output in Card.objects.all()
        ]
        return Response(output)


class CardInfoSend(APIView):
    def post(self,request):
        serializer = CardInfo(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            card = Card.objects.get(cardID=request.data.get('cardID'))
            output = [
                {
                    "balance": card.balance
                }
            ]
            return Response(output)

    def get(self,request):
        output = [
            {
                "userID": output.userID,
                "cardID": output.cardID,
                "balance": output.balance
            } for output in Card.objects.all()
        ]
        return Response(output)

class TopUp(APIView):

    def post(self,request):
        serializer = TopUpBalance(data=request.data)
        if(serializer.is_valid(raise_exception=True)):
            payment = Payment.create({
                "amount": {
                    "value": request.data.get('topUP'),
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "http://localhost:3000/user"
                },
                "capture": True,
                "description": "Заказ №1"
            }, uuid.uuid4())
            topUp = PaymentBalance(orderID=payment.id, userID=request.data.get('userID'), cardID=request.data.get('cardID'),
                                   topUP=request.data.get('topUP'), approve=False, bonus=request.data.get('bonus'))
            topUp.save()

            card = Card.objects.get(userID=request.data.get('userID'))
            card.balance = card.balance + int(request.data.get('topUP')) + int(request.data.get('bonus'))
            card.save()
            topUp.approve = True
            topUp.save()
            print(payment.confirmation.confirmation_url)
            return HttpResponseRedirect(payment.confirmation.confirmation_url)

    def get(self,request):
        output = [
            {
                "userID": output.userID,
                "cardID": output.cardID,
                "balance": output.balance
            } for output in Card.objects.all()
        ]
        return Response(output)




class Notification(APIView):

    permission_classes = [AllowAny]

    def post(self,request):
        payment_id = request.data['object']['id']
        Payment.capture(payment_id)

        topUp = PaymentBalance.objects.get(orderID=payment_id)
        topUp.approve = True
        card = Card.objects.get(userID=topUp.userID)
        card.balance = card.balance + topUp.topUP + topUp.bonus
        card.save()
        topUp.save()
        return HttpResponse(status=200)
