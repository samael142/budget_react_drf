from django.shortcuts import redirect
from django.urls import reverse_lazy


class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated or 'register' in request.path:
            return
        else:
            while not (request.path == reverse_lazy('accounts:login')):
                return redirect(reverse_lazy('accounts:login'))
