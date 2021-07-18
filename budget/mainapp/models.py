from django.db import models


# Create your models here.
class Header(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name

    @staticmethod
    def add_header_to_transaction(header):
        headers_list = Header.objects.all()
        for el in headers_list:
            if el.name == header:
                return el.pk
        new_header = Header(name=header)
        new_header.save()
        return new_header.pk


class Category(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name

    @staticmethod
    def add_category_to_transaction(category):
        categories_list = Category.objects.all()
        for el in categories_list:
            if el.name == category:
                return el.pk
        new_category = Category(name=category)
        new_category.save()
        return new_category.pk


class Subcategory(models.Model):
    name = models.CharField(verbose_name='название', max_length=64, unique=True)

    def __str__(self):
        return self.name

    @staticmethod
    def add_subcategory_to_transaction(subcategory):
        subcategories_list = Subcategory.objects.all()
        for el in subcategories_list:
            if el.name == subcategory:
                return el.pk
        new_subcategory = Subcategory(name=subcategory)
        new_subcategory.save()
        return new_subcategory.pk
