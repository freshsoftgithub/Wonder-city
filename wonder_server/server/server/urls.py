"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path as url
from backend_api.views import *
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('admin/', admin.site.urls),
    path('userRegistration', UserInfoView.as_view()),
    path('confirm', ConfirmCode.as_view()),
    path('userLogin', UserLogin.as_view()),
    path('userProfile', UserProfile.as_view()),
    path('reserv', ReservRequset.as_view()),
    path('TopUp', TopUp.as_view()),
    path('saveCard', SaveCard.as_view()),
    path('cardInfo', CardInfoSend.as_view()),
    path('api/v3/payments', csrf_exempt(Notification.as_view()))
]
