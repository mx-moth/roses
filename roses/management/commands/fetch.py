from django.core.management import BaseCommand

from roses.feeds import fetch_feed
from roses.models import Feed


class Command(BaseCommand):
    def handle(self, **options):
        for feed in self.find_feeds().iterator():
            fetch_feed(feed)

    def find_feeds(self):
        return Feed.objects.stale()
