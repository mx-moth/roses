from django.contrib.admin import ModelAdmin, register

from .models import Article, Feed, Folder


@register(Folder)
class FolderAdmin(ModelAdmin):
    pass


@register(Feed)
class FeedAdmin(ModelAdmin):
    pass


@register(Article)
class ArticleAdmin(ModelAdmin):
    pass
