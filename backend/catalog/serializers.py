from rest_framework import serializers
from .models import Electives, Programs

class ElectiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Electives
        fields = '__all__'

class ProgramSerializer(serializers.ModelSerializer):

    class Meta:
        model = Programs
        fields = '__all__'