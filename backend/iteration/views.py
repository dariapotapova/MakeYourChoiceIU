from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Stream
from .serializers import StreamSerializer
from catalog.models import Electives
from catalog.serializers import ElectiveSerializer


class StreamViewSet(viewsets.ModelViewSet):
    serializer_class = StreamSerializer
    queryset = Electives.objects.all()

    def get_queryset(self):

        semester_id = self.request.query_params.get('semesterId')

        queryset = Stream.objects.all()

        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)

        return queryset


    # GET /streams/{id}/electives
    @action(detail=True,methods=['get'],url_path='electives')
    def get_electives(self, request, pk=None):

        stream = self.get_object()

        electives = stream.electives.all()

        serializer = ElectiveSerializer(electives, many=True)

        return Response(serializer.data)


    # POST /streams/{id}/electives
    @action(detail=True,methods=['post'],url_path='electives')
    def add_electives(self, request, pk=None):
        stream = self.get_object()

        elective_ids = request.data.get('electiveIds', [])

        electives = Electives.objects.filter(id__in=elective_ids)

        stream.electives.add(*electives)

        return Response({"status": "added"})


    # DELETE /streams/{id}/electives/{electiveId}
    @action(detail=True,methods=['delete'],url_path='electives/(?P<elective_id>[^/.]+)')
    def remove_elective(self, request, pk=None, elective_id=None):

        stream = self.get_object()

        stream.electives.remove(elective_id)

        return Response({"status": "removed"})