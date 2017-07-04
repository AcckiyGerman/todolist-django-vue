from django.db import models
import json


class Project(models.Model):
    name = models.CharField(max_length=20)
    colour = models.CharField(max_length=20)

    def __str__(self):
        return self.name


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
