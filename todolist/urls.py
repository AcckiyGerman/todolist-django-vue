from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # projects
    url(r'projects_list/$', views.projects_list),
    url(r'add_project/$', views.add_project),
    url(r'update_project/$', views.update_project),
    url(r'delete_project/$', views.delete_project),
    # tasks
    url(r'tasks_list/$', views.tasks_list),
    url(r'add_task/$', views.add_task),
    url(r'update_task/$', views.update_task),
    url(r'delete_task/$', views.delete_task),
    # user auth
    url(r'login/$', auth_views.login, name='login'),
    url(r'logout/$', auth_views.logout,
        {'next_page': 'index'}, name='logout'),
]
