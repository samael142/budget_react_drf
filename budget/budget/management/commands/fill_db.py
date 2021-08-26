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
            new_money_account = MoneyAccount(**money_account)
            new_money_account.save()

        plain_operations = load_from_json('plain_operations')
        PlainOperation.objects.all().delete()
        for plain_operation in plain_operations:
            new_plain_operation = PlainOperation(**plain_operation)
            new_plain_operation.save()

        transactions = load_from_json('transactions')
        Transaction.objects.all().delete()
        for transaction in transactions:
            new_transaction = Transaction(**transaction)
            new_transaction.save()

        budgets = load_from_json('budget')
        BudgetPeriod.objects.all().delete()
        for budget in budgets:
            new_budget = BudgetPeriod(**budget)
            new_budget.save()
