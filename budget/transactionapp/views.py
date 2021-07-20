from datetime import datetime
from maapp.models import MoneyAccount
from mainapp.models import Header, Category, Subcategory
from .models import Transaction, PlainOperation
from django.http import JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
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
#
#
# # Create your views here.
# def transaction_create(request):
#     title = 'транзакция/создание'
#     money_accounts = MoneyAccount.objects.all()
#     headers = Header.objects.all()
#     categories = Category.objects.all()
#     subcategories = Subcategory.objects.all()
#
#     if request.method == 'POST':
#         if request.POST['operation_type'] == 'out':
#             operation_summ = float(request.POST['operation_summ']) * -1
#         else:
#             operation_summ = float(request.POST['operation_summ'])
#         post_data_dict = {
#             'operation_date': request.POST['operation_date'],
#             'operation_summ': operation_summ,
#             'account': request.POST['account'],
#             'header': Header.add_header_to_transaction(request.POST['header']),
#             'category': Category.add_category_to_transaction(request.POST['category']),
#             'subcategory': Subcategory.add_subcategory_to_transaction(request.POST['subcategory']),
#             'comment': request.POST['comment'],
#         }
#         if 'plain' in request.POST:
#             post_data_dict.pop('account', None)
#             post_data_dict['period'] = request.POST['period']
#             if request.POST['period'] != 'once':
#                 post_data_dict['quantity'] = PlainOperation.quantity_count(request.POST['operation_date'],
#                                                                            request.POST['trip-end'],
#                                                                            request.POST['period'])
#             else:
#                 post_data_dict['quantity'] = '1'
#             plain_operation_form = PlainOperationForm(post_data_dict)
#             if plain_operation_form.is_valid():
#                 plain_operation_form.save()
#                 PlainOperation.add_plain_transactions()
#                 return HttpResponseRedirect(reverse('index'))
#         else:
#             transaction_form = TransactionForm(post_data_dict)
#
#             if transaction_form.is_valid():
#                 transaction_form.save()
#                 if 'add' in request.POST:
#                     return HttpResponseRedirect(reverse('index'))
#                 else:
#                     return HttpResponseRedirect(reverse('transactions:transaction_create'))
#     content = {
#         'title': title,
#         'headers': headers,
#         'categories': categories,
#         'subcategories': subcategories,
#         'money_accounts': money_accounts,
#         'date': datetime.today().strftime('%Y-%m-%d')
#     }
#     return render(request, 'transactionapp/transaction.html', content)


def transaction_autoform(request, header_name):
    formObj = {'cat': '', 'subcat': ''}
    try:
        header = Header.objects.filter(name=header_name).first()
        transaction = Transaction.objects.filter(header=header.pk).first()
        formObj = {'cat': str(transaction.category), 'subcat': str(transaction.subcategory)}
    except:
        pass
    return JsonResponse(formObj)
