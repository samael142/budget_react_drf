import json
import os

from django.core.management.base import BaseCommand
from ...models import Header, Category, Subcategory, BudgetPeriod
from maapp.models import Currency, MoneyAccount
from transactionapp.models import Transaction, PlainOperation

JSON_PATH = 'budget/jsons'


def load_from_json(file_name):
    with open(os.path.join(JSON_PATH, file_name + '.json'), 'r') as infile:
        return json.load(infile)


class Command(BaseCommand):
    def handle(self, *args, **options):
        headers = load_from_json('headers')
        Header.objects.all().delete()
        for header in headers:
            new_header = Header(**header)
            new_header.save()

        categories = load_from_json('categories')
        Category.objects.all().delete()
        for category in categories:
            new_category = Category(**category)
            new_category.save()

        subcategories = load_from_json('subcategories')
        Subcategory.objects.all().delete()
        for subcategory in subcategories:
            new_subcategory = Subcategory(**subcategory)
            new_subcategory.save()

        currencies = load_from_json('currency')
        Currency.objects.all().delete()
        for currency in currencies:
            new_currency = Currency(**currency)
            new_currency.save()

        money_accounts = load_from_json('money_accounts')
        MoneyAccount.objects.all().delete()
        for money_account in money_accounts:
            currency_pk = money_account['currency']
            _currency = Currency.objects.get(pk=currency_pk)
            money_account['currency'] = _currency
            new_money_account = MoneyAccount(**money_account)
            new_money_account.save()

        plain_operations = load_from_json('plain_operations')
        PlainOperation.objects.all().delete()
        for plain_operation in plain_operations:

            header_pk = plain_operation['header']
            _header = Header.objects.get(pk=header_pk)
            plain_operation['header'] = _header

            category_pk = plain_operation['category']
            _category = Category.objects.get(pk=category_pk)
            plain_operation['category'] = _category

            subcategory_pk = plain_operation['subcategory']
            _subcategory = Subcategory.objects.get(pk=subcategory_pk)
            plain_operation['subcategory'] = _subcategory

            new_plain_operation = PlainOperation(**plain_operation)
            new_plain_operation.save()

        transactions = load_from_json('transactions')
        Transaction.objects.all().delete()
        for transaction in transactions:
            header_pk = transaction['header']
            _header = Header.objects.get(pk=header_pk)
            transaction['header'] = _header
            try:
                category_pk = transaction['category']
                _category = Category.objects.get(pk=category_pk)
                transaction['category'] = _category
            except:
                pass

            try:
                subcategory_pk = transaction['subcategory']
                _subcategory = Subcategory.objects.get(pk=subcategory_pk)
                transaction['subcategory'] = _subcategory
            except:
                pass

            try:
                plain_id_pk = transaction['plain_id']
                _plain_id = PlainOperation.objects.get(pk=plain_id_pk)
                transaction['plain_id'] = _plain_id
            except:
                pass

            try:
                money_account_pk = transaction['account']
                _money_account = MoneyAccount.objects.get(pk=money_account_pk)
                transaction['account'] = _money_account
            except:
                pass

            new_transaction = Transaction(**transaction)
            new_transaction.save()

        # budgets = load_from_json('budget')
        # BudgetPeriod.objects.all().delete()
        # for budget in budgets:
        #     category_pk = budget['category']
        #     _category = Category.objects.get(pk=category_pk)
        #     budget['category'] = _category
        #
        #     new_budget = BudgetPeriod(**budget)
        #     new_budget.save()
