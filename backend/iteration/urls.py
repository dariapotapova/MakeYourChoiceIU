from rest_framework.routers import DefaultRouter
from .views import StreamViewSet

router = DefaultRouter()

router.register('streams', StreamViewSet)

urlpatterns = router.urls