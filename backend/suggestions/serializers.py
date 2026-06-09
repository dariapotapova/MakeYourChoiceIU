from rest_framework import serializers
from .models import Suggestion


class SuggestionCreateSerializer(serializers.ModelSerializer):
    """Used for POST /suggestions and PATCH /suggestions/edit/{token}"""

    class Meta:
        model = Suggestion
        fields = ['name', 'instructor', 'description', 'elective_language',
                  'format', 'prerequisite', 'contact']


class SuggestionSerializer(serializers.ModelSerializer):
    """Used for GET responses (admin list and author edit view)."""

    class Meta:
        model = Suggestion
        fields = ['id', 'name', 'instructor', 'description', 'elective_language',
                  'format', 'prerequisite', 'contact', 'status', 'edit_token', 'created_at']
        read_only_fields = fields
