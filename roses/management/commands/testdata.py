import datetime

from django.contrib.auth.models import User
from django.core.management import BaseCommand
from django.db import transaction

from roses.feeds import fetch_feed
from roses.models import Feed, FeedDisplayStyle, Folder


class Command(BaseCommand):

    @transaction.atomic
    def handle(self, **options):
        User.objects.filter(username='test').delete()
        self.user = self.create_user()
        self.folder = self.create_folder()
        self.feeds = self.create_feeds()
        self.fetch()

    def create_user(self):
        return User.objects.create_superuser('test', 'test@example.com', 'p')

    def create_folder(self):
        return Folder.objects.create(
            user=self.user,
            name='Folder')

    def create_feeds(self):
        return Feed.objects.bulk_create([
            Feed(
                folder=self.folder,
                name='xkcd',
                feed_url='https://xkcd.com/rss.xml',
                homepage='https://xkcd.com/',

                order=1,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.description,
            ),
            Feed(
                folder=self.folder,
                name='Gunnerkrigg Court',
                feed_url='https://www.gunnerkrigg.com/rss.xml',
                homepage='https://www.gunnerkrigg.com/',

                order=2,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.url,
            ),
            Feed(
                folder=self.folder,
                name='Girl Genius',
                feed_url='http://www.girlgeniusonline.com/ggmain.rss',
                homepage='http://www.girlgeniusonline.com/',

                order=3,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.url,
            ),
            Feed(
                folder=self.folder,
                name='The Daily WTF',
                feed_url='http://syndication.thedailywtf.com/TheDailyWtf',
                homepage='https://www.thedailywtf.com/',

                order=4,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.url,
            ),
            Feed(
                folder=self.folder,
                name='Dinosaur Comics',
                feed_url='http://www.rsspect.com/rss/qwantz.xml',
                homepage='http://www.qwantz.com',

                order=5,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.description,
            ),
            Feed(
                folder=self.folder,
                name='Questionable Content',
                feed_url='https://www.questionablecontent.net/QCRSS.xml',
                homepage='https://www.questionablecontent.net/',

                order=6,
                fetch_interval=datetime.timedelta(hours=1),
                show_as=FeedDisplayStyle.description,
            ),
        ])

    def fetch(self):
        for feed in self.feeds:
            fetch_feed(feed)
