from django.db import models


# Create your models here.
class Currency(models.Model):
    name = models.CharField(verbose_name='название', max_length=3, unique=True)

    def __str__(self):
        return self.name


class MoneyAccount(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)
    currency = models.ForeignKey(Currency, on_delete=models.RESTRICT)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class MaInfo(models.Model):
    # ma_id = models.BigIntegerField(verbose_name='pk')
    name = models.CharField(verbose_name='название', max_length=64)
    sum = models.DecimalField(verbose_name="сумма", max_digits=10, decimal_places=2)
    is_visible = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'ma_info'
