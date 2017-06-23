from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from todolist.models import Project
import json


# Create your views here.
@login_required
def index(request):
    context = {}
    return render(request, 'todolist/index.html', context)


def projects_list(request):
    """returns all projects in json format"""
    json_data = json.dumps(
        [{'name': p.name, 'colour': p.colour}
         for p in Project.objects.all()]
    )

    return HttpResponse(json_data, content_type='application/json')
