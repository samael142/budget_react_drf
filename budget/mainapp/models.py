from django.db import models


# Create your models here.
class Header(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name
