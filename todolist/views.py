from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from todolist.models import Project, Task
import json


# Create your views here.
@login_required
def index(request):
    context = {}
    return render(request, 'todolist/index.html', context)


def projects_list(request):
    """returns all projects in json format"""
    json_data = json.dumps(
        [{'name': p.name, 'colour': p.colour, 'id': p.id}
         for p in Project.objects.all()]
    )
    return HttpResponse(json_data, content_type='application/json')


def add_project(request):
    new_project = json.loads(request.body.decode('utf-8'))
    p = Project(name=new_project['name'], colour=new_project['colour'])
    p.save()
    return HttpResponse(
        json.dumps({'name': p.name, 'colour': p.colour, 'id': p.id}),
        content_type='application/json'
    )


def delete_project(request):
    project_id = json.loads(request.body.decode('utf-8'))
    Project.objects.filter(id=project_id).delete()
    return HttpResponse(json.dumps('project deleted.'), content_type='application/json')


def tasks_list(request):
    """returns all tasks in json format"""
    json_data = json.dumps(
        [{'name': t.name} for t in Task.objects.all()]
    )
    return HttpResponse(json_data, content_type='application/json')
