from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest
from todolist.models import Project, Task
from django.core.exceptions import ObjectDoesNotExist
import json
import datetime


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
    error_msg = Project.validate(new_project)
    if error_msg:
        return HttpResponseBadRequest(error_msg)

    p = Project(name=new_project['name'], colour=new_project['colour'])
    p.save()
    return HttpResponse(
        json.dumps({'name': p.name, 'colour': p.colour, 'id': p.id}),
        content_type='application/json'
    )


def update_project(request):
    project = json.loads(request.body.decode('utf-8'))
    error_msg = Project.validate(project)
    if error_msg:
        return HttpResponseBadRequest(error_msg)
    try:
        p = Project.objects.get(id=project['id'])
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps('object does not exists'))
    p.name = project['name']
    p.colour = project['colour']
    p.save()
    return HttpResponse(
        json.dumps('project updated.'),
        content_type='application/json'
    )


def delete_project(request):
    project_id = json.loads(request.body.decode('utf-8'))
    try:
        p = Project.objects.get(id=project_id)
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps('object does not exists'))

    unfinished_tasks = p.task_set.filter(finished=False)
    if unfinished_tasks:
        return HttpResponseBadRequest(
            'Finish tasks:\n' + '\n'.join([str(t) for t in unfinished_tasks])
        )
    p.delete()
    return HttpResponse(json.dumps('project deleted.'), content_type='application/json')


def tasks_list(request):
    """returns all tasks in json format"""
    json_data = json.dumps(
        [{'id': t.id,
          'name': t.name,
          'project_id': t.project_id,
          'project': t.project.name,
          'project_color': t.project.colour,
          'priority': t.priority,
          'finish_date': str(t.finish_date),
          'finished': t.finished}
            for t in Task.objects.all()]
    )
    return HttpResponse(json_data, content_type='application/json')


def add_task(request):
    new_task = json.loads(request.body.decode('utf-8'))
    error_msg = Task.validate(new_task)
    if error_msg:
        return HttpResponseBadRequest(error_msg)
    t = Task(project_id=new_task['project_id'],
             name=new_task['name'],
             priority=new_task['priority'],
             finished=False)
    year, month, day = map(int, new_task['finish_date'].split('-'))
    t.finish_date = datetime.date(year, month, day)
    t.save()
    return HttpResponse(t.to_json())


def update_task(request):
    task = json.loads(request.body.decode('utf-8'))
    error_msg = Task.validate(task)
    if error_msg:
        return HttpResponseBadRequest(error_msg)
    try:
        t = Task.objects.get(id=task['id'])
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps('object does not exists'))
    t.name = task['name']
    t.priority = task['priority']
    year, month, day = map(int, task['finish_date'].split('-'))
    t.finish_date = datetime.date(year, month, day)
    t.finished = task['finished']
    t.save()
    return HttpResponse(json.dumps('task updated.'), content_type='application/json')


def delete_task(request):
    task_id = json.loads(request.body.decode('utf-8'))
    Task.objects.filter(id=task_id).delete()
    return HttpResponse(json.dumps('task deleted.'), content_type='application/json')

