from datetime import datetime
from django.db.models import Sum
from maapp.models import MoneyAccount
from mainapp.models import Header, Category, Subcategory
from .models import Transaction, PlainOperation
from django.http import JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.dates import MonthArchiveView
from django.views.generic.list import ListView
from django.urls import reverse_lazy
from django.db.models.signals import post_save
from django.dispatch import receiver


class TransactionCreateView(CreateView):
    model = Transaction
    template_name = 'transactionapp/transaction.html'
    fields = ('operation_date', 'operation_summ', 'account', 'header', 'category', 'subcategory', 'comment')
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'транзакция/создание'
        context['money_accounts'] = MoneyAccount.objects.all()
        context['headers'] = Header.objects.all()
        context['categories'] = Category.objects.all()
        context['subcategories'] = Subcategory.objects.all()
        context['date'] = datetime.today().strftime('%Y-%m-%d')
        if self.request.META.get('HTTP_REFERER'):
            if 'transactions/create' in self.request.META.get('HTTP_REFERER'):
                context['date'] = Transaction.get_last_transaction().operation_date.strftime('%Y-%m-%d')
                context['default_account'] = Transaction.get_last_transaction().account
        return context

    def post(self, request, **kwargs):
        request.POST = request.POST.copy()
        if request.POST['operation_type'] == 'out':
            operation_summ = float(request.POST['operation_summ']) * -1
        else:
            operation_summ = float(request.POST['operation_summ'])
        request.POST['header'] = Header.add_header_to_transaction(request.POST['header'])
        request.POST['category'] = Category.add_category_to_transaction(request.POST['category'])
        request.POST['subcategory'] = Subcategory.add_subcategory_to_transaction(request.POST['subcategory'])
        request.POST['operation_summ'] = operation_summ
        if 'plain' in request.POST:
            if request.POST['period'] != 'once':
                request.POST['quantity'] = PlainOperation.quantity_count(request.POST['operation_date'],
                                                                         request.POST['trip-end'],
                                                                         request.POST['period'])
            else:
                request.POST['quantity'] = 1
            self.model = PlainOperation
            self.fields = ('operation_date', 'operation_summ', 'header',
                           'category', 'subcategory', 'comment', 'period', 'quantity')
        return super(TransactionCreateView, self).post(request, **kwargs)

    def get_success_url(self):
        if 'add' in self.request.POST:
            success_url = 'index'
        else:
            success_url = 'transactionapp:transaction_create'
        return reverse_lazy(success_url)

    @staticmethod
    @receiver(post_save, sender=PlainOperation)
    def add_plain_transactions(sender, **kwargs):
        PlainOperation.add_plain_transactions()

    @staticmethod
    def transaction_autoform(request, header_name):
        formObj = {'cat': '', 'subcat': ''}
        try:
            header = Header.objects.filter(name=header_name).first()
            transaction = Transaction.objects.filter(header=header.pk).first()
            formObj = {'cat': str(transaction.category), 'subcat': str(transaction.subcategory)}
        except:
            pass
        return JsonResponse(formObj)


class TransactionsListView(MonthArchiveView):
    # queryset = Transaction.objects.all()
    date_field = "operation_date"
    allow_future = True
    template_name = "transactionapp/transactions.html"
    month_format = '%m'
    # year = datetime.now().strftime('%Y')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'транзакции'
        context['total'] = Transaction.get_total_balance()
        return context

    def get_queryset(self):
        queryset = Transaction.objects.all().order_by('operation_date')
        return queryset
