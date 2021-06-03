from django.shortcuts import render
from templates import app
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import HttpResponse,HttpResponseRedirect
from .forms import UserForm,UserProfileInfoForm
from .models import  UserProfileInfo
from django.contrib.auth.models import User
from django.conf import settings
################################################################
from .models import Message
# Create your views here.

def index(request):
    return render(request,'app/base.html')

@login_required
def startvc(request,room_name):
    
    all_users = User.objects.exclude(id=request.user.id)
    username = request.user.username
    context={'username':username,'room_name':room_name,'allUsers':all_users}
    l=room_name.split('and')
    
    try:
        fir=int(l[0])
        context['fir']=fir
        las=int(l[-1])
        context['las']=las
    except:
        pass
    
    
    return render(request,'app/startvc.html',context)

@login_required
def joinvc(request,room_name):
    
    all_users = User.objects.exclude(id=request.user.id)
    context={'room_name':room_name,'allUsers':all_users}
    l=room_name.split('and')
    try:
        fir=int(l[0])
        context['fir']=fir
        las=int(l[-1])
        context['las']=las
    except:
        pass
    
    return render(request,'app/joinvc.html',context)
    

@login_required
def room(request,room_name):
    all_users = User.objects.exclude(id=request.user.id)
    username = request.user.username
    userID=request.user.id
    messages = Message.objects.filter(room=room_name)[::-1][0:15][::-1]
    l=room_name.split('and')
    contextd={'room_name':room_name,'allUsers':all_users,'username':username, 'messages': messages,'userID':userID}
    try:
        fir=int(l[0])
        contextd['fir']=fir
        las=int(l[-1])
        contextd['las']=las
    except:
        pass
    
    return render(request,'app/room.html',contextd)

@login_required
def chatRoom(request):
    all_users = User.objects.exclude(id=request.user.id)
    username = request.user.username
    return render(request,'app/chatroom.html',{'allUsers':all_users,'username':username},)

@login_required
def accountInfo(request):
    return render(request,'app/account.html')

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

@login_required
def another(request):
    all_users = User.objects.exclude(id=request.user.id)
    username = request.user.username
    all_userd=[]
    for i in all_users:
        all_userd.append(i.id)
        
    return render(request,'app/base2.html',{'allUsers':all_users,'username':username,'all_userd':all_userd})

def user_login(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')

        user=authenticate(username=username,password=password)

        if user:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect(reverse('another'))
            else:
                return HttpResponse('Account not active bud!')

        else:
            print('login failure')
            return HttpResponse('NO USER FOUND')
    else:
        return render(request,'app/login.html',{})
    
def register(request):
    registered=False
    profile=None

    if request.method =='POST':
        user_form=UserForm(data=request.POST)
        profile_form=UserProfileInfoForm(data=request.POST)

        if user_form.is_valid() and profile_form.is_valid():
            user=user_form.save()
            user.set_password(user.password)
            user.save()

            profile=profile_form.save(commit=False)
            profile.user=user
            registered=True

            if 'profile_pic' in request.FILES:
                profile.profile_pic=request.FILES['profile_pic']
                profile.save()

        else:
            print(user_form.errors,profile_form.errors)
    else:
        user_form=UserForm()
        profile_form=UserProfileInfoForm()

    return render(request,'app/register.html',{'user_form':user_form,'profile_form':profile_form,'registered':registered,'profile':profile})

#################################################################

    