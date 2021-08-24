from django.contrib import admin
from .models import *


# Register your models here.
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('operation_date', 'operation_summ', 'account',
                    'header', 'category', 'subcategory', 'past', 'created')
    ordering = ('-operation_date',)
    pass


# admin.site.register(Transaction)
admin.site.register(PlainOperation)
