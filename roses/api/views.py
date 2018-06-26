from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from roses.models import Article, Feed, Folder

from . import serializers


class ForUserMixin(viewsets.ModelViewSet):
    """
    Restrict the queryset to articles related to the current user. The queryset is
    filtered by calling the ``for_user(user)`` method.
    """
    def get_queryset(self):
        return super().get_queryset().for_user(self.request.user)


class FolderViewSet(ForUserMixin, viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = serializers.FolderSerializer


class FeedViewSet(ForUserMixin, viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = serializers.FeedSerializer


class ArticleViewSet(ForUserMixin, viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = serializers.ArticleSerializer

    filter_backends = [DjangoFilterBackend]
    # TODO Change ``feed__folder`` into ``folder``
    filter_fields = ['feed', 'feed__folder', 'read']

    @action(methods=['post'], detail=True)
    def mark_read(self, request, pk=None):
        article = self.get_object()
        article.read = True
        article.save(update_fields=['read'])
        return Response(status=204)
