"""
URL configuration for ntkesevai project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import include, path
from django.shortcuts import redirect
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework import routers
#from tutorial.quickstart.views import views
from ntkesevai.webapi.services.users import views as user_views
from ntkesevai.webapi.services.home import views as home_views
from ntkesevai.webapi.services.master import views as master_views
from ntkesevai.webapi.services.servicerequest import views as servicerequest_views

router = routers.DefaultRouter()

def redirect_root(request):
    return redirect('/api/services/')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(user_views.urlpatterns)),
    path('api/home/', include(home_views.urlPatterns)),
    path('api/master/', include(master_views.urlPatterns)),
    path('api/service/', include(servicerequest_views.urlPatterns)),
    path('api/GetLogin/', user_views.CustomAuthToken.as_view(), name='GetLogin'),
    path('api-auth/login/', obtain_auth_token),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/services/', servicerequest_views.ServiceWithMappingView.as_view(), name='service-list'),
    path('api/services1/', servicerequest_views.ServiceWithoutMappingView.as_view(), name='service-list1'),
    path('api/servicesdetails/', servicerequest_views.ServiceDetailsView.as_view(), name='service-list2'),
    path('api/master/revenuevillagelist/', master_views.RevenueVillageView.as_view(), name='service-list2'),
    path('admin/', admin.site.urls),
]