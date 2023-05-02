from django.shortcuts import render
from rest_framework.views import APIView
from .models import User
from .serializer import UserSerializer
from .serializer import UserLoginSerializer
from rest_framework.response import Response

class UserInfoView(APIView):
    def post(self,request):
        seriarlizer = UserSerializer(data=request.data)
        if(seriarlizer.is_valid(raise_exception=True)):
            seriarlizer.save()
            return Response(seriarlizer.data)

    def get(self, request):
        output = [
            {
                "email": output.email,
                "password": output.password,
                "name": output.name
            } for output in User.objects.all()
        ]
        return Response(output)

class UserLogin(APIView):

     def post(self, request):
         serializer = UserLoginSerializer(data=request.data)
         if (serializer.is_valid(raise_exception=True)):
             gettedEmail = request.data.get('email')
             gettedPassword = request.data.get('password')
             print(gettedPassword)
             print(gettedEmail)
             return Response(serializer.data)


     def get(self, request):
         print(request)
         gettedEmail = request.data.get('email')
         gettedPassword = request.data.get('password')
         print(gettedEmail)
         output = 'Err'
         if(User.objects.filter(email = gettedEmail, password = gettedPassword).exists()):
              output = [
                 {
                        "name": output.name
                    } for output in User.objects.all()
               ]
         return Response(output)