import django_filters
from transactionapp.models import Transaction


class DateFilter(django_filters.FilterSet):
    month = django_filters.NumberFilter(field_name='operation_date', lookup_expr='month')
    year = django_filters.NumberFilter(field_name='operation_date', lookup_expr='year')
    # q = django_filters.CharFilter(method='my_custom_filter', label="Search")

    # class Meta:
    #     model = Transaction
    #     fields = ['month', 'year']
