from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # user auth
    url(r'login/$', auth_views.login, name='login'),
    url(r'logout/$', auth_views.logout,
        {'next_page': 'index'}, name='logout'),
]
