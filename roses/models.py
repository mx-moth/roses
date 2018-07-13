import datetime
import uuid

from django.db import models
from django.db.models import ExpressionWrapper, F, Q
from django.utils import timezone
from enumchoicefield import ChoiceEnum, EnumChoiceField
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from positions.fields import PositionField


class UUIDModelMixin(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)

    class Meta:
        abstract = True


class FolderQuerySet(models.QuerySet):
    def select_sensible(self):
        return self

    def for_user(self, user):
        return self.filter(user=user)


class Folder(UUIDModelMixin, MPTTModel):
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=255)
    parent = TreeForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True,
        related_name='children')

    objects = FolderQuerySet.as_manager()

    def __str__(self):
        return self.name


class FeedDisplayStyle(ChoiceEnum):
    description = 'Article description'
    url = 'Article URL'


class FeedQuerySet(models.QuerySet):
    def select_sensible(self):
        return self.select_related('folder')

    def for_user(self, user):
        return self\
            .select_sensible()\
            .filter(folder__user=user)

    def annotate_stale(self):
        return self.annotate(expiry=ExpressionWrapper(
            F('last_fetched') + F('fetch_interval'),
            output_field=models.DateTimeField()))

    def stale_q(self, when=None):
        if when is None:
            when = timezone.now()

        return Q(last_fetched=None) | Q(expiry__lt=when)

    def stale(self):
        return self.annotate_stale().filter(self.stale_q())

    def not_stale(self):
        return self.annotate_stale().exclude(self.stale_q())


class Feed(UUIDModelMixin, models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    feed_url = models.URLField(max_length=255)
    homepage = models.URLField(max_length=255)

    order = PositionField(collection=['folder'])
    last_fetched = models.DateTimeField(null=True, blank=True)
    fetch_interval = models.DurationField()
    show_as = EnumChoiceField(
        FeedDisplayStyle, verbose_name="Display article as")

    objects = FeedQuerySet.as_manager()

    class Meta:
        ordering = ['folder', 'order']

    def __str__(self):
        return self.name


class ArticleQuerySet(models.QuerySet):
    def select_sensible(self):
        return self.select_related('feed', 'feed__folder')

    def for_user(self, user):
        return self\
            .select_sensible()\
            .filter(feed__folder__user=user)

    def stale(self, when=None):
        """
        Find all stale articles. An article is stale if it has been read, and
        it was published over 30 days ago. The cutoff point is configurable by
        passing a :class:`datetime.datetime` instance. Articles older than this
        will be considered stale.
        """
        # TODO Make expiry time configurable. Per feed? Per user?
        if when is None:
            when = timezone.now() - datetime.timezone(days=30)

        return self.filter(read=True, published_date__lte=when)


class Article(UUIDModelMixin, models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)

    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    guid = models.CharField(max_length=255, blank=True, db_index=True)
    published_date = models.DateTimeField()

    xml = models.TextField()

    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    objects = ArticleQuerySet.as_manager()

    class Meta:
        ordering = ['-published_date']
        index_together = [
            ['feed', 'guid'],
        ]

    def __str__(self):
        return self.title
