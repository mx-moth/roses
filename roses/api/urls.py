from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'folders', views.FolderViewSet)
router.register(r'feeds', views.FeedViewSet)
router.register(r'articles', views.ArticleViewSet)

urlpatterns = router.urls
