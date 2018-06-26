from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic.base import (
    ContextMixin, TemplateResponseMixin, TemplateView, View)


class ErrorView(TemplateResponseMixin, ContextMixin, View):
    """
    Render a template. Pass keyword arguments from the URLconf to the context.
    """
    status = 200

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context, status=self.status)


@method_decorator(login_required, name='dispatch')
class IndexView(TemplateView):
    template_name = 'layouts/index.html'
