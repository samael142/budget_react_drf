from django.db import models


# Create your models here.
class Currency(models.Model):
    name = models.CharField(verbose_name='название', max_length=3, unique=True)

    def __str__(self):
        return self.name


class MoneyAccount(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)
    currency = models.ForeignKey(Currency, on_delete=models.RESTRICT)

    def __str__(self):
        return self.name
