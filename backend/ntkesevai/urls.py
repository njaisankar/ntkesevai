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
from tutorial.quickstart.views import views
from .webapi.views import DistrictViewSet, ServiceRequestViewSet, HomePageViewSet, SocialMediaViewSet, ContactsViewSet, UserViewSet,GroupViewSet
from .webapi.views import api_root, ServiceView,Service1View, ServiceDetailsView, RevenueVillageView
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
# router.register(r'services', ServiceView.as_view())
# router.register(r'services', Service1View)
# router.register(r'services', ServiceDetailsView)
#router.register(r'services', RevenueVillageView, basename="\\")
router.register(r'DistrictDetails', DistrictViewSet,basename="NTKESevai1")
router.register('ServiceRequestDetails', ServiceRequestViewSet,basename="NTKESevai2")
router.register('HomePageDetails', HomePageViewSet)
router.register('SocialMediaDeails', SocialMediaViewSet)
router.register('ContactDetails', ContactsViewSet)

def redirect_root(request):
    return redirect('/api/services/')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    #path('services', include(api_root)),
    path('api-auth/login/', obtain_auth_token),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/services/', ServiceView.as_view(), name='service-list'),
    path('api/services1/', Service1View.as_view(), name='service-list1'),
    path('api/servicesdetails/', ServiceDetailsView.as_view(), name='service-list2'),
    path('api/revenuevillagelist/', RevenueVillageView.as_view(), name='service-list2'),
    path('admin/', admin.site.urls),
]