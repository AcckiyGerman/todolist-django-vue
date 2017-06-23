from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'projects_list/$', views.projects_list),
    url(r'tasks_list/$', views.tasks_list),
    # user auth
    url(r'login/$', auth_views.login, name='login'),
    url(r'logout/$', auth_views.logout,
        {'next_page': 'index'}, name='logout'),
]
