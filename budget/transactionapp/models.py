from datetime import datetime, timedelta
import calendar
from random import randint
from django.db import models
from django.db.models import Sum
from maapp.models import MoneyAccount
from budget.models import Header, Category, Subcategory


class PlainOperation(models.Model):
    class PeriodType(models.TextChoices):
        once = "once"
        daily = "daily"
        monthly = "monthly"

    operation_date = models.DateField(verbose_name='дата первой транзакции')
    operation_summ = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    header = models.ForeignKey(Header, on_delete=models.RESTRICT)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.RESTRICT)
    comment = models.TextField(blank=True)
    period = models.CharField(max_length=10, choices=PeriodType.choices)
    quantity = models.PositiveSmallIntegerField(verbose_name="количество операций", default=1)
    count = models.PositiveSmallIntegerField(null=True, blank=True, default=1)

    @staticmethod
    def quantity_count(start_date, end_date, per, count):
        datetime_start_date = datetime.strptime(start_date, "%Y-%m-%d")
        datetime_end_date = datetime.strptime(end_date, "%Y-%m-%d")
        if per == "daily":
            return ((abs((datetime_end_date - datetime_start_date).days)) // int(count)) + 1
        elif per == "monthly":
            delta = 0
            while True:
                mdays = calendar.monthrange(datetime_start_date.year, datetime_start_date.month)[1]
                datetime_start_date += timedelta(days=mdays)
                if datetime_start_date <= datetime_end_date:
                    delta += 1
                else:
                    break
            return (delta // int(count)) + 1

    @staticmethod
    def add_plain_transactions(instance):
        plain_operation_object = instance
        if plain_operation_object.period == 'once':
            transaction = Transaction(operation_date=plain_operation_object.operation_date,
                                      operation_summ=plain_operation_object.operation_summ,
                                      account=None,
                                      header=plain_operation_object.header,
                                      category=plain_operation_object.category,
                                      subcategory=plain_operation_object.subcategory,
                                      comment=plain_operation_object.comment,
                                      past=True,
                                      plain_id=plain_operation_object, )
            transaction.save()
        elif plain_operation_object.period == 'daily' or plain_operation_object.period == 'monthly':
            operation_date = plain_operation_object.operation_date
            for n in range(plain_operation_object.quantity):
                transaction = Transaction(operation_date=operation_date,
                                          operation_summ=plain_operation_object.operation_summ,
                                          account=None,
                                          header=plain_operation_object.header,
                                          category=plain_operation_object.category,
                                          subcategory=plain_operation_object.subcategory,
                                          comment=plain_operation_object.comment,
                                          past=True,
                                          plain_id=plain_operation_object, )
                transaction.save()
                if plain_operation_object.period == 'daily':
                    operation_date = operation_date + timedelta(days=plain_operation_object.count)
                else:
                    for _ in range(plain_operation_object.count):
                        days_in_month = calendar.monthrange(operation_date.year, operation_date.month)[1]
                        operation_date = operation_date + timedelta(days=days_in_month)


class Transaction(models.Model):
    operation_date = models.DateField(verbose_name='дата', db_index=True)
    operation_summ = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    account = models.ForeignKey(MoneyAccount, on_delete=models.RESTRICT, null=True, blank=True, related_name="ma")
    header = models.ForeignKey(Header, on_delete=models.RESTRICT, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, null=True, blank=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.RESTRICT, null=True, blank=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    past = models.BooleanField(default=False)
    plain_id = models.ForeignKey(PlainOperation, on_delete=models.RESTRICT, null=True, blank=True)
    transfer_id = models.CharField(max_length=8, null=True, blank=True)

    @staticmethod
    def get_last_transaction():
        transaction_object = Transaction.objects.latest('id')
        return transaction_object

    @staticmethod
    def get_total_balance(pk=None):
        total_dict = {}
        total_summ = 0
        if pk:
            query = Transaction.objects.filter(account=pk).values('operation_date'). \
                order_by('operation_date'). \
                annotate(total=Sum('operation_summ'))
        else:
            query = Transaction.objects.exclude(account__is_visible=0).values('operation_date'). \
                order_by('operation_date'). \
                annotate(total=Sum('operation_summ'))
        for el in query:
            total_summ += float(el['total'])
            total_dict[el['operation_date'].strftime("%d-%m-%Y")] = round(total_summ, 2)
        return total_dict


class TotalBalance(models.Model):
    operation_date = models.DateField(verbose_name='дата', db_index=True)
    total = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    case = models.CharField(verbose_name='день', max_length=7)

    class Meta:
        managed = False
        db_table = 'total_balance'


class TotalBalancePerAccount(models.Model):
    operation_date = models.DateField(verbose_name='дата', db_index=True)
    total = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    account = models.ForeignKey(MoneyAccount, on_delete=models.RESTRICT, null=True, blank=True)
    case = models.CharField(verbose_name='день', max_length=7)

    class Meta:
        managed = False
        db_table = 'total_balance_per_account'


class Transfer:

    def __init__(self, account_from, account_to, operation_date, operation_summ):
        self.account_from = account_from
        self.account_to = account_to
        self.operation_date = operation_date
        self.operation_summ = operation_summ

    def create_transfer(self):
        money_account_from = MoneyAccount.objects.get(pk=self.account_from)
        money_account_to = MoneyAccount.objects.get(pk=self.account_to)
        transfer_id = randint(0, 100000000)
        transaction_from = Transaction(operation_date=self.operation_date,
                                       account=money_account_from,
                                       operation_summ=float(self.operation_summ) * -1,
                                       transfer_id=transfer_id,
                                       comment=f'Перевод на {money_account_to.name}')
        transaction_to = Transaction(operation_date=self.operation_date,
                                     account=money_account_to,
                                     operation_summ=float(self.operation_summ),
                                     transfer_id=transfer_id,
                                     comment=f'Перевод с {money_account_from.name}')
        transaction_from.save()
        transaction_to.save()

    def update_transfer(self, transfer_id):
        transactions = Transaction.objects.filter(transfer_id=transfer_id)
        transaction_from = None
        transaction_to = None
        for transaction in transactions:
            if int(transaction.operation_summ < 0):
                transaction_from = transaction
            if int(transaction.operation_summ > 0):
                transaction_to = transaction
        transaction_from.operation_summ = float(self.operation_summ) * -1
        transaction_from.account = MoneyAccount.objects.get(pk=self.account_from)
        transaction_from.operation_date = self.operation_date
        transaction_to.operation_summ = self.operation_summ
        transaction_to.account = MoneyAccount.objects.get(pk=self.account_to)
        transaction_to.operation_date = self.operation_date
        transaction_from.save()
        transaction_to.save()
        pass

    @staticmethod
    def delete_transfer(transfer_id):
        transactions = Transaction.objects.filter(transfer_id=transfer_id)
        for transaction in transactions:
            transaction.delete()
