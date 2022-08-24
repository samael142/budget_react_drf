import django_filters


class DateFilter(django_filters.FilterSet):
    month = django_filters.NumberFilter(field_name='operation_date', lookup_expr='month')
    year = django_filters.NumberFilter(field_name='operation_date', lookup_expr='year')
    acc = django_filters.NumberFilter(field_name='account')
    date = django_filters.DateFilter(field_name='operation_date')
    category = django_filters.CharFilter(field_name='category__name')
    past = django_filters.BooleanFilter(field_name='past')
    # q = django_filters.CharFilter(method='my_custom_filter', label="Search")

    # class Meta:
    #     model = Transaction
    #     fields = ['month', 'year']
