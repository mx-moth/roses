import datetime
import logging
import time

import feedparser
from django.db import transaction
from django.utils import timezone

from .models import Article

logger = logging.getLogger(__name__)


def to_datetime(timetuple):
    if timetuple is None:
        return None
    when = datetime.datetime.fromtimestamp(time.mktime(timetuple))
    return timezone.make_aware(when, timezone=timezone.utc)


@transaction.atomic()
def fetch_feed(feed):
    logger.info("Fetching feed '%s' (URL %s)", feed, feed.feed_url)

    response = feedparser.parse(feed.feed_url)
    now = timezone.now()

    for entry in response.entries:
        article, created = Article.objects.update_or_create(
            feed=feed,
            guid=entry.id,
            defaults=dict(
                title=getattr(entry, 'title', 'Untitled'),
                description=getattr(entry, 'description', ''),
                url=getattr(entry, 'link', feed.homepage),
                published_date=to_datetime(entry.published_parsed) or now,
            ),
        )
        logger.info("%s article '%s' (GUID '%s')",
                    "Created" if created else "Updated",
                    article, article.guid)

    feed.last_fetched = now
    feed.save()


def remove_stale_articles(articles, when=None):
    """
    Remove stale articles from the queryset that have been read and are older than
    a threshold.
    """

    articles.stale().delete()
