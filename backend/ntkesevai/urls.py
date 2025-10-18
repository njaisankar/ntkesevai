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
from django.conf import settings
from django.conf.urls.static import static
router = routers.DefaultRouter()

def redirect_root(request):
    return redirect('/api/services/')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(user_views.urlpatterns)),
    path('api/home/', include(home_views.urlPatterns)),
    path('api/GetLogin/', user_views.CustomAuthToken.as_view(), name='GetLogin'),
    path('api/forgotpassword/', user_views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/resetpassword/', user_views.ResetPasswordView.as_view(), name='reset-password'),
            
    path('api-auth/login/', obtain_auth_token),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
    path('api/service/', include(servicerequest_views.urlPatterns)),
    path('api/service/services/', servicerequest_views.ServiceWithMappingView.as_view(), name='service-list'),
    path('api/service/services1/', servicerequest_views.ServiceWithoutMappingView.as_view(), name='service-list1'),
    path('api/service/servicesdetails/', servicerequest_views.ServiceDetailsView.as_view(), name='service-list2'),
    path('api/service/serviceslinks/', servicerequest_views.ServiceLinksView.as_view(), name='service-links'),
    path('api/service/serviceseditrequest/', servicerequest_views.ServiceRequestForEditRecordView.as_view(), name='service-request-edit'),

    path('api/master/', include(master_views.urlPatterns)),
    path('api/master/blocklist/', master_views.BlockView.as_view(), name='block-list'),
    path('api/master/townpanchayatlist/', master_views.TownPanchayatView.as_view(), name='town-panchayat-list'),
    path('api/master/panchayatlist/', master_views.PanchayatView.as_view(), name='panchayat-list'),
    path('api/master/revenuevillagelist/', master_views.RevenueVillageView.as_view(), name='revenue-village-list'),
    path('api/master/townvillagestreetlist/', master_views.VillageStreetView.as_view(), name='village-street-list'),

    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)