from rest_framework.routers import DefaultRouter
from .views import ElectiveViewSet, ProgramViewSet, TrackViewSet, ElectiveTypeViewSet

router = DefaultRouter()

router.register('electives', ElectiveViewSet)
router.register('programs', ProgramViewSet)
router.register('tracks', TrackViewSet)
router.register('elective_types', ElectiveTypeViewSet)

urlpatterns = router.urls