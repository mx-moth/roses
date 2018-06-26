"""
URLs for Roses.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import TemplateView

import roses.account.urls
import roses.api.urls

from .views import ErrorView, IndexView

handler404 = ErrorView.as_view(template_name='layouts/404.html', status=404)
handler500 = ErrorView.as_view(template_name='layouts/500.html', status=500)

urlpatterns = [
    path('robots.txt', TemplateView.as_view(
        content_type='text/plain', template_name='robots.txt')),

    path('admin/', admin.site.urls),

    path('404/', handler404),
    path('500/', handler500),

    path(r'api/', include(roses.api.urls)),
    path(r'account/', include(roses.account.urls, namespace='account')),
    path('', IndexView.as_view()),
]


if settings.DEFAULT_FILE_STORAGE == \
        'django.core.files.storage.FileSystemStorage':
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
