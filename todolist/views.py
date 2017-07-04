from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest
from todolist.models import Project, Task
import json, re


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
    # validation
    check_msg = check_project(new_project)
    if check_msg != 'ok':
        return HttpResponseBadRequest(check_msg)

    p = Project(name=new_project['name'], colour=new_project['colour'])
    p.save()
    return HttpResponse(
        json.dumps({'name': p.name, 'colour': p.colour, 'id': p.id}),
        content_type='application/json'
    )


def update_project(request):
    project = json.loads(request.body.decode('utf-8'))
    # validation:
    check_msg = check_project(project)
    if check_msg != 'ok':
        return HttpResponseBadRequest(check_msg)

    p = Project.objects.filter(id=project['id'])[0]
    p.name = project['name']
    p.colour = project['colour']
    p.save()
    return HttpResponse(
        json.dumps('project updated.'),
        content_type='application/json'
    )


def delete_project(request):
    project_id = json.loads(request.body.decode('utf-8'))
    Project.objects.filter(id=project_id).delete()
    return HttpResponse(json.dumps('project deleted.'), content_type='application/json')


def tasks_list(request):
    """returns all tasks in json format"""
    json_data = json.dumps(
        [{'name': t.name,
          'project_id': t.project_id,
          'project': t.project.name,
          'project_color': t.project.colour,
          'priority': t.priority,
          'date_to_finish': str(t.date_to_finish),
          'finished': t.finished}
         for t in Task.objects.all()]
    )
    return HttpResponse(json_data, content_type='application/json')


def add_task(request):
    new_task = json.loads(request.body.decode('utf-8'))
    check_msg = check_task(new_task)
    if check_msg != 'ok':
        return HttpResponseBadRequest(check_msg)
    return HttpResponse(json.dumps(new_task))

# help functions (not a view)
def check_project(project):
    if len(project['name']) > 20:
        return 'name is too long'
    if len(project['name']) < 3:
        return 'name is too short'
    if project['colour'] not in ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'violet', 'white']:
        return 'wrong color'
    return 'ok'


def check_task(task):
    if len(task['name']) > 20: return 'name is too long'
    if len(task['name']) < 3 : return 'name is too short'
    if task['priority'] not in ['red', 'orange', 'white']: return 'wrong priority'
    if not Project.objects.filter(id=task['project_id']) : return 'no such project'
    date = re.compile("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")
    if not re.match(date, task['finish_date']):
        return 'Wrong date, use this format: YYYY-MM-DD'
    return 'ok'