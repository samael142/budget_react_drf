from datetime import datetime

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .forms import TransactionForm
from maapp.models import MoneyAccount
from mainapp.models import Header, Category, Subcategory
from .models import Transaction
from django.http import JsonResponse


# Create your views here.
def transaction_create(request):
    title = 'транзакция/создание'
    money_accounts = MoneyAccount.objects.all()
    headers = Header.objects.all()
    categories = Category.objects.all()
    subcategories = Subcategory.objects.all()

    if request.method == 'POST':
        if request.POST['operation_type'] == 'out':
            operation_summ = float(request.POST['operation_summ']) * -1
        else:
            operation_summ = float(request.POST['operation_summ'])
        transaction_form = TransactionForm({
            'operation_date': request.POST['operation_date'],
            'operation_summ': operation_summ,
            'account': request.POST['account'],
            'header': Header.add_header_to_transaction(request.POST['header']),
            'category': Category.add_category_to_transaction(request.POST['category']),
            'subcategory': Subcategory.add_subcategory_to_transaction(
                request.POST['subcategory']),
            'comment': request.POST['comment'],
            'period': request.POST['comment'],
        })

        if transaction_form.is_valid():
            transaction_form.save()
            if 'add' in request.POST:
                return HttpResponseRedirect(reverse('index'))
            else:
                return HttpResponseRedirect(reverse('transactions:transaction_create'))
    else:
        transaction_form = TransactionForm()
    content = {
        'title': title,
        'transaction_form': transaction_form,
        'headers': headers,
        'categories': categories,
        'subcategories': subcategories,
        'money_accounts': money_accounts,
        'date': datetime.today().strftime('%Y-%m-%d')
    }
    return render(request, 'transactionapp/transaction.html', content)


def transaction_autoform(request, header_name):
    formObj = {'cat': '', 'subcat': ''}
    try:
        header = Header.objects.filter(name=header_name).first()
        transaction = Transaction.objects.filter(header=header.pk).first()
        formObj = {'cat': str(transaction.category), 'subcat': str(transaction.subcategory)}
    except:
        pass
    return JsonResponse(formObj)
