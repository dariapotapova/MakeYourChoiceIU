from django.db import models

class ProgramLanguages(models.Model):
    language = models.CharField(unique=True, primary_key=True, max_length=3)

class Degree(models.Model):
    degree_year = models.CharField(unique=True, primary_key=True, max_length=10)

class ElectiveTypes(models.Model):
    elective_type_name = models.CharField(max_length=20, unique=True, primary_key=True)

class Electives(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    description = models.TextField()
    elective_type = models.ForeignKey(ElectiveTypes, null=True, on_delete=models.RESTRICT)
    language = models.ForeignKey(ProgramLanguages, on_delete=models.CASCADE)
    status = models.IntegerField(default=0) # 0 - archived, 1 - active
    degree_year = models.ManyToManyField(Degree, blank=True)
    prerequisite = models.TextField()

class Programs(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=200)
    language = models.ForeignKey(ProgramLanguages, on_delete=models.CASCADE)

class Tracks(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=10)
    program = models.ForeignKey(Programs, on_delete=models.CASCADE) # if a program is deleted, track is deleted, too