from django.db import models
from maapp.models import MoneyAccount
from mainapp.models import Header, Category, Subcategory


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
    quantity = models.PositiveSmallIntegerField


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
