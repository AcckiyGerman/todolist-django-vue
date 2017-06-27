from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=20)
    colour = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    date_to_finish = models.DateTimeField()
    finished = models.BooleanField(default=False)

    def __str__(self):
        return self.name
