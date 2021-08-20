from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class UserRegisterForm(UserCreationForm):
    error_messages = {
        'duplicate_username': 'Пользователь с таким именем уже существует',
        'duplicate_email': 'Пользователь с таким адресом уже существует',
    }

    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email']

    def clean_username(self):
        username = self.cleaned_data["username"]

        try:
            User._default_manager.get(username=username)
            raise forms.ValidationError(
                self.error_messages['duplicate_username'],
                code='duplicate_username',
            )
        except User.DoesNotExist:
            return username

    def clean_email(self):
        email = self.cleaned_data["email"]

        try:
            User._default_manager.get(email=email)
            raise forms.ValidationError(
                self.error_messages['duplicate_email'],
                code='duplicate_email',
            )
        except User.DoesNotExist:
            return email
