from django.urls import path
from app import views
from django.conf import settings
from django.conf.urls.static import static

app_name='app'

urlpatterns=[
    
    path('login/',views.user_login,name='user_login'),
    path('register/',views.register,name='register'),
    path('app/<str:room_name>/',views.room,name="room"),
    path('startvc/<str:room_name>/',views.startvc,name="startvc"),
    path('joinvc/<str:room_name>/',views.joinvc,name="joinvc"),
    
]