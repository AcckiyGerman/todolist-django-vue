from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'projects_list/$', views.projects_list),
    url(r'add_project/$', views.add_project),
    url(r'update_project/$', views.update_project),
    url(r'delete_project/$', views.delete_project),
    url(r'tasks_list/$', views.tasks_list),
    # user auth
    url(r'login/$', auth_views.login, name='login'),
    url(r'logout/$', auth_views.logout,
        {'next_page': 'index'}, name='logout'),
]
