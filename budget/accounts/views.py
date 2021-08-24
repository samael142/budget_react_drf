from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.http import HttpResponseRedirect, HttpResponse

# Create your views here.
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import CreateView, TemplateView

from budget import settings
from .forms import UserRegisterForm


class RegisterView(CreateView):
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('accounts:login')
    form_class = UserRegisterForm
    success_message = "Your profile was created successfully"

    def form_valid(self, form):
        if self.request.recaptcha_is_valid:
            self.object = form.save()
            return super().form_valid(form)
        return self.render_to_response(self.get_context_data(form=form))

    @receiver(post_save, sender=User)
    def user_to_inactive(sender, instance, created, update_fields, **kwargs):
        if created:
            instance.is_active = False
            mail_subject = 'Activate budget account.'
            message = render_to_string('accounts/email_admin_activation_body.html', {
                'username': instance.username,
                'email': instance.email,
            })
            to_email = settings.EMAIL_HOST_USER
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()


class LoginView(TemplateView):
    success_url = reverse_lazy('index')
    template_name = 'accounts/login.html'

    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse_lazy(settings.LOGIN_REDIRECT_URL))
            else:
                return HttpResponseRedirect(reverse_lazy(settings.LOGIN_URL))
        else:
            try:
                user_form = User.objects.get(username=request.POST['username'])
                if not user_form.is_active:
                    messages.error(request, 'Пользователь не активирован')
            except:
                messages.error(request, 'Неверное имя пользователя или пароль')
            return HttpResponseRedirect(reverse_lazy(settings.LOGIN_URL))


class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse_lazy(settings.LOGIN_URL))
