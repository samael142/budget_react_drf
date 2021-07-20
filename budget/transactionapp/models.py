from datetime import datetime, timedelta
import calendar
from django.db import models
from maapp.models import MoneyAccount
from mainapp.models import Header, Category, Subcategory
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
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

    @staticmethod
    def quantity_count(start_date, end_date, per):
        datetime_start_date = datetime.strptime(start_date, "%Y-%m-%d")
        datetime_end_date = datetime.strptime(end_date, "%Y-%m-%d")
        if per == "daily":
            return abs((datetime_end_date - datetime_start_date).days) + 1
        elif per == "monthly":
            delta = 0
            while True:
                mdays = calendar.monthrange(datetime_start_date.year, datetime_start_date.month)[1]
                datetime_start_date += timedelta(days=mdays)
                if datetime_start_date <= datetime_end_date:
                    delta += 1
                else:
                    break
            return delta + 1

    @staticmethod
    def add_plain_transactions():
        plain_operation_object = PlainOperation.objects.latest('id')
        print(plain_operation_object)
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
                    operation_date = operation_date + timedelta(days=1)
                else:
                    days_in_month = calendar.monthrange(operation_date.year, operation_date.month)[1]
                    operation_date = operation_date + timedelta(days=days_in_month)


class Transaction(models.Model):
    operation_date = models.DateField(verbose_name='дата')
    operation_summ = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    account = models.ForeignKey(MoneyAccount, on_delete=models.RESTRICT, null=True, blank=True)
    header = models.ForeignKey(Header, on_delete=models.RESTRICT)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.RESTRICT)
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
