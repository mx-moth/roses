import logging

from django.core.management import BaseCommand

from roses.feeds import fetch_feed, remove_stale_articles
from roses.models import Article, Feed

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, **options):
        for feed in self.find_feeds().iterator():
            try:
                fetch_feed(feed)
            except Exception as e:
                logger.exception(e)
                self.stderr.write(str(e))

        remove_stale_articles(self.find_articles())

    def find_feeds(self):
        return Feed.objects.stale()

    def find_articles(self):
        return Article.objects.all()
