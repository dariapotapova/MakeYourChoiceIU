from django.db import models
from login import models as login_models
from catalog import models as catalog_models

# class StudentChoice(models.Model):
#     student_id = models.ForeignKey(login_models.Student, on_delete=models.CASCADE)
#     elective_type = models.ForeignKey(catalog_models.ElectiveType, on_delete=models.CASCADE)
#     priority = models.IntegerField()
#     elective_id = models.ForeignKey(catalog_models.Elective, on_delete=models.CASCADE)
