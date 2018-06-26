from rest_framework import serializers

from roses.models import Article, Feed, Folder


class FolderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'lft', 'rght', 'tree_id', 'parent']


class FeedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Feed
        fields = [
            'id', 'folder',
            'name', 'feed_url', 'homepage',
            'order', 'last_fetched', 'fetch_interval', 'show_as',
        ]


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Article
        fields = [
            'id', 'feed', 'feed_id',
            'title', 'description', 'url',
            'guid', 'published_date', 'read',
        ]
