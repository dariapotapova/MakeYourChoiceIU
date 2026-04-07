from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from .models import Admin, Student
from catalog.models import Elective
from iteration.models import Iteration, StreamElectiveRelation

from .serializers import (
    StudentResponseSerializer,
    AdminResponseSerializer,
    AdminStudentResponseSerializer
)

@api_view(["GET"])
def auth_email(request):
    email = request.GET.get("email")

    admin = Admin.objects.filter(mail=email).first()
    student = Student.objects.filter(mail=email).first()

    role_map = {
        0: "admin",
        1: "admin-student"
    }
    
    if admin:
        admin_data = {
            "role": role_map.get(admin.role),
            "email": admin.mail,
            "all_electives": Elective.objects.all()
        }

        if admin.role == 0:
            serializer = AdminResponseSerializer(admin_data)
            return Response(serializer.data)

    if student:
        iteration = Iteration.objects.filter(
            deadline__gt=timezone.now()
        ).prefetch_related("streams").first()

        student_data = {
            "deadline": None,
            "available_electives": []
        }

        student_response_data = {
            "role": "student",
            "email": student.mail,
            "student_data": student_data
        }

        if iteration:
            student_data["deadline"] = iteration.deadline

            streams = iteration.streams.filter(
                degree_year=student.degree_year,
                programs=student.program
            ).select_related("elective_type")

            for stream in streams:
                relations = StreamElectiveRelation.objects.filter(
                    stream_id=stream,
                    elective_id__status=1
                ).select_related("elective_id")

                electives = [
                    {
                        "id": r.elective_id.id,
                        "name": r.elective_id.name,
                        "instructor": r.elective_id.instructor,
                        "description": r.elective_id.description,
                        "elective_language": r.elective_id.elective_language,
                        "prerequisite": r.elective_id.prerequisite
                    }
                    for r in relations
                ]

                student_data["available_electives"].append({
                    "elective_type": stream.elective_type.elective_type_name,
                    "priorities": stream.priorities,
                    "electives": electives
                })

            student_response_data["student_data"] = student_data
        
        if admin and admin.role == 1:
            full_data = {
                "role": role_map.get(admin.role),
                "email": admin.mail,
                "all_electives": Elective.objects.all(),
                "student_data": student_data
            }
            serializer = AdminStudentResponseSerializer(full_data)
            return Response(serializer.data)

        serializer = StudentResponseSerializer(student_response_data)
        return Response(serializer.data)
    
    return Response({"error": "User not found"}, status=404)
    
