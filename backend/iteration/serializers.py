from rest_framework import serializers
from .models import Stream
from catalog.models import Programs

class StreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stream
        fields = '__all__'

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programs
        fields = '__all__'