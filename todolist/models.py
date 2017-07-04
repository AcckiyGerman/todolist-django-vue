from django.db import models
import json
import re


class Project(models.Model):
    name = models.CharField(max_length=20)
    colour = models.CharField(max_length=20)

    def __str__(self):
        return self.name

    @staticmethod
    def validate(project):
        if len(project['name']) > 20:
            return 'name is too long'
        if len(project['name']) < 3:
            return 'name is too short'
        if project['colour'] not in ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'violet', 'white']:
            return 'wrong color'
        return 'ok'


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    finish_date = models.DateField()
    finished = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def to_json(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'project_id': self.project_id,
            'project': self.project.name,
            'project_color': self.project.colour,
            'priority': self.priority,
            'finish_date': str(self.finish_date),
            'finished': self.finished  
        })

    @staticmethod
    def validate(task):
        if len(task['name']) > 20: return 'name is too long'
        if len(task['name']) < 3: return 'name is too short'
        if task['priority'] not in ['red', 'orange', 'white']: return 'wrong priority'
        if not Project.objects.filter(id=task['project_id']): return 'no such project'
        date = re.compile("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")
        if not re.match(date, task['finish_date']):
            return 'Wrong date, use this format: YYYY-MM-DD'
        if not type(task['finished']) == bool: return 'wrong finished field'
        return 'ok'
