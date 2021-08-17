from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic.list import ListView
from transactionapp.models import Transaction
from .models import MoneyAccount, Currency
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.views.generic.edit import CreateView


# Create your views here.


class AccountsListView(ListView):
    template_name = 'maapp/accounts.html'
    model = Transaction

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'счета'
        context['year'] = datetime.now().strftime('%Y')
        context['month'] = datetime.now().strftime('%m')
        return context

    def get_queryset(self):
        queryset = Transaction.objects. \
            select_related('account'). \
            filter(past=0). \
            values('account__name', 'account__is_visible', 'account'). \
            annotate(total_summ=Sum('operation_summ'))
        return queryset

    @staticmethod
    def hide_control(request, pk):
        account = get_object_or_404(MoneyAccount, pk=pk)
        if account.is_visible == 1:
            account.is_visible = 0
        else:
            account.is_visible = 1
        account.save()
        return HttpResponse(200)


class AccountCreateView(CreateView):
    model = MoneyAccount
    template_name = 'maapp/account.html'
    fields = ('name', 'currency')
    success_url = reverse_lazy('accounts:accounts')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Создание счёта'
        context['currency'] = Currency.objects.all()
        return context
