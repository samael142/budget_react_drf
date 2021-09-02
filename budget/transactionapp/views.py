from datetime import datetime
from django.db.models import Sum
from maapp.models import MoneyAccount
from budget.models import Header, Category, Subcategory
from .models import Transaction, PlainOperation, Transfer
from django.http import JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.dates import MonthArchiveView
from django.views.generic.list import ListView
from django.urls import reverse_lazy
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.views.generic.base import TemplateView
from django.shortcuts import redirect


class PlainOperationsListView(ListView):
    template_name = "transactionapp/plainoperations.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'плановые операции'
        return context

    def get_queryset(self):
        queryset = []
        queryset_element = {}
        source_queryset = PlainOperation.objects.all()
        for el in source_queryset:
            transactions_array = Transaction.objects.filter(plain_id=el.pk).order_by('operation_date')
            queryset_element['id'] = el.pk
            queryset_element['header'] = el.header
            queryset_element['category'] = el.category
            queryset_element['subcategory'] = el.subcategory
            queryset_element['summ'] = el.operation_summ
            if len(transactions_array) != 0:
                queryset_element['curr_date'] = transactions_array.first().operation_date
                queryset_element['end_date'] = transactions_array.last().operation_date
                queryset_element['disabled_status'] = 0
            else:
                queryset_element['curr_date'] = "--"
                queryset_element['end_date'] = "--"
                queryset_element['disabled_status'] = 1
            queryset.append(queryset_element)
            queryset_element = {}
        return queryset


class PlainOperationUpdateView(UpdateView):
    model = PlainOperation
    template_name = 'transactionapp/plainoperation.html'
    fields = '__all__'
    success_url = reverse_lazy('transactionapp:plain_operations')

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.transactions_array = Transaction.objects.filter(plain_id=self.kwargs['pk']).order_by('operation_date')


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        period_names = {'once': 'Разовая', 'daily':'Ежедневная', 'monthly':'Ежемесячная'}
        context['title'] = 'плановая/редактирование'
        context['period_name'] = period_names[self.get_object().period]

        if len(self.transactions_array) != 0:
            context['start_date'] = str(self.transactions_array.first().operation_date)
            context['end_date'] = str(self.transactions_array.last().operation_date)
        else:
            context['start_date'] = datetime.today().strftime('%Y-%m-%d')
            context['end_date'] = datetime.today().strftime('%Y-%m-%d')
        return context

    def post(self, request, **kwargs):
        self.transactions_array.delete()
        request.POST = request.POST.copy()
        request.POST['header'] = Header.add_header_to_transaction(request.POST['header'])
        request.POST['category'] = Category.add_category_to_transaction(request.POST['category'])
        request.POST['subcategory'] = Subcategory.add_subcategory_to_transaction(request.POST['subcategory'])
        if request.POST['operation_type'] == 'out':
            operation_summ = float(request.POST['operation_summ']) * -1
        else:
            operation_summ = float(request.POST['operation_summ'])
        request.POST['operation_summ'] = operation_summ
        if request.POST['period'] != 'once':
            request.POST['quantity'] = PlainOperation.quantity_count(request.POST['operation_date'],
                                                                     request.POST['trip-end'],
                                                                     request.POST['period'])
        else:
            request.POST['quantity'] = 1
        return super(PlainOperationUpdateView, self).post(request, **kwargs)


class PlainOperationDeleteView(DeleteView):
    model = PlainOperation
    success_url = reverse_lazy('transactions:plain_operations')

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.transactions_array = Transaction.objects.filter(plain_id=self.kwargs['pk']).order_by('operation_date')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.transactions_array.delete()
        return self.delete(request, *args, **kwargs)


class TransactionsListView(MonthArchiveView):
    date_field = "operation_date"
    allow_future = True
    template_name = "transactionapp/transactions.html"
    month_format = '%m'
    allow_empty = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'транзакции'
        if 'pk' in self.kwargs:
            context['total'] = Transaction.get_total_balance(self.kwargs['pk'])
            context['account'] = self.kwargs['pk']
        else:
            context['total'] = Transaction.get_total_balance()
        return context

    def get_queryset(self):
        if 'pk' in self.kwargs:
            return Transaction.objects.filter(account=self.kwargs['pk'],
                                              operation_date__year=self.kwargs['year'],
                                              operation_date__month=self.kwargs['month']).order_by('operation_date', '-updated')
        else:
            return Transaction.objects.filter(operation_date__year=self.kwargs['year'],
                                              operation_date__month=self.kwargs['month']).order_by('operation_date', '-updated')


class TransactionCreateView(CreateView):
    model = Transaction
    template_name = 'transactionapp/transaction.html'
    fields = ('operation_date', 'operation_summ', 'account', 'header', 'category', 'subcategory', 'comment')
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'транзакция/создание'
        context['money_accounts'] = MoneyAccount.objects.all().order_by('name')
        context['headers'] = Header.objects.all()
        context['categories'] = Category.objects.all().order_by('name')
        context['subcategories'] = Subcategory.objects.all().order_by('name')
        context['date'] = datetime.today().strftime('%Y-%m-%d')
        if self.request.META.get('HTTP_REFERER'):
            if 'transactionapp/create' in self.request.META.get('HTTP_REFERER'):
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
            transaction = Transaction.objects.filter(header=header.pk, past=0).order_by('-operation_date').first()
            formObj = {'cat': str(transaction.category), 'subcat': str(transaction.subcategory)}
        except:
            pass
        return JsonResponse(formObj)


class TransactionUpdateView(UpdateView):
    model = Transaction
    template_name = 'transactionapp/transaction.html'
    fields = ('operation_date', 'operation_summ', 'account', 'header', 'category', 'subcategory', 'comment', 'past', 'plain_id')
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'транзакция/редактирование'
        context['date'] = str(self.get_object().operation_date)
        context['operation_summ'] = self.get_object().operation_summ
        context['default_account'] = self.get_object().account
        context['header'] = self.get_object().header
        context['category'] = self.get_object().category
        context['subcategory'] = self.get_object().subcategory
        context['past'] = self.get_object().past
        context['comment'] = self.get_object().comment
        context['money_accounts'] = MoneyAccount.objects.all().order_by('name')
        context['headers'] = Header.objects.all()
        context['categories'] = Category.objects.all().order_by('name')
        context['subcategories'] = Subcategory.objects.all().order_by('name')
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
        if 'deactivate' in request.POST:
            request.POST['past'] = True
            request.POST['account'] = None
        if 'activate' in request.POST:
            request.POST['past'] = False
            request.POST['plain_id'] = None
        return super(TransactionUpdateView, self).post(request, **kwargs)


class TransactionDeleteView(DeleteView):
    model = Transaction
    success_url = reverse_lazy('index')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class TransferCreateView(TemplateView):
    template_name = 'transactionapp/transfer.html'
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'перевод/создание'
        context['money_accounts'] = MoneyAccount.objects.all()
        context['date'] = datetime.today().strftime('%Y-%m-%d')
        return context


    def post(self, request, **kwargs):
        account_from = request.POST['money_account_from']
        account_to = request.POST['money_account_to']
        summ = request.POST['summ']
        operation_date = request.POST['trip-start']
        new_transfer = Transfer(account_from, account_to, operation_date, summ)
        new_transfer.create_transfer()
        del new_transfer
        return redirect(self.success_url)


class TransferUpdateView(TemplateView):
    template_name = 'transactionapp/transfer.html'
    success_url = reverse_lazy('index')

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        transactions = Transaction.objects.filter(transfer_id=self.kwargs['transfer_id'])
        for transaction in transactions:
            self.kwargs['operation_summ'] = abs(float(transaction.operation_summ))
            self.kwargs['operation_date'] = str(transaction.operation_date)
            if int(transaction.operation_summ) < 0:
                self.kwargs['account_from'] = transaction.account
            if int(transaction.operation_summ) > 0:
                self.kwargs['account_to'] = transaction.account


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'перевод/изменение'
        context['money_accounts'] = MoneyAccount.objects.all()
        context['summ'] = self.kwargs['operation_summ']
        context['date'] = self.kwargs['operation_date']
        context['account_from'] = self.kwargs['account_from']
        context['account_to'] = self.kwargs['account_to']
        context['transfer_id'] = self.kwargs['transfer_id']
        return context

    def post(self, request, **kwargs):
        update_transfer = Transfer(request.POST['money_account_from'],
                                   request.POST['money_account_to'],
                                   request.POST['trip-start'],
                                   request.POST['summ'])
        update_transfer.update_transfer(self.kwargs['transfer_id'])
        del update_transfer
        return redirect(self.success_url)

class TransferDeleteView(TemplateView):
    success_url = reverse_lazy('index')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

    def post(self, request, **kwargs):
        Transfer.delete_transfer(self.kwargs['transfer_id'])
        return redirect(self.success_url)
