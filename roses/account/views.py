from django.contrib.auth.views import LoginView, LogoutView


class LoginView(LoginView):
    template_name = 'layouts/account/login.html'


class LogoutView(LogoutView):
    pass
