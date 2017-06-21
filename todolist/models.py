from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=200)
    colour = models.CharField(max_length=20)


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    priority = models.CharField(max_length=20)
    date_to_finish = models.DateTimeField()
    finished = models.BooleanField(default=False)
