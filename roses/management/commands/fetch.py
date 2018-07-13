from django.core.management import BaseCommand

from roses.feeds import fetch_feed, remove_stale_articles
from roses.models import Article, Feed


class Command(BaseCommand):
    def handle(self, **options):
        for feed in self.find_feeds().iterator():
            fetch_feed(feed)
        remove_stale_articles(self.find_articles())

    def find_feeds(self):
        return Feed.objects.stale()

    def find_articles():
        return Article.objects.all()
