from django import forms
from .models import Transaction, PlainOperation


# class TransactionForm(forms.ModelForm):
#     class Meta:
#         model = Transaction
#         fields = ('operation_date', 'operation_summ', 'account', 'header', 'category', 'subcategory', 'comment')
#
#     def __init__(self, *args, **kwargs):
#         super(TransactionForm, self).__init__(*args, **kwargs)


# class PlainOperationForm(forms.ModelForm):
#     class Meta:
#         model = PlainOperation
#         fields = ('operation_date', 'operation_summ', 'header',
#                   'category', 'subcategory', 'comment', 'period', 'quantity')
#
#     def __init__(self, *args, **kwargs):
#         super(PlainOperationForm, self).__init__(*args, **kwargs)
