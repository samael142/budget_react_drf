from datetime import datetime, timedelta
from xml.sax.handler import property_declaration_handler

from django.db.models import Sum
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .serializers import HeaderModelSerializer, \
    CategoryModelSerializer, \
    SubcategoryModelSerializer, \
    TransactionModelListSerializer, \
    TransactionModelSerializer, \
    MoneyAccountListModelSerializer, \
    TotalBalanceModelSerializer, \
    TotalBalancePerAccountModelSerializer, \
    PlainOperationModelListSerializer, \
    PlainOperationModelSerializer, \
    MoneyAccountModelSerializer, \
    ReportSerializer, \
    StatisticSerializer, \
    BudgetModelListSerializer, \
    BudgetModelSerializer, \
    BudgetDetailSerializer
from budget.models import Header, Category, Subcategory, BudgetPeriod
from transactionapp.models import Transaction, TotalBalance, PlainOperation, TotalBalancePerAccount
from maapp.models import MaInfo, MoneyAccount
from .filters import DateFilter
import itertools


class HeaderModelViewSet(ModelViewSet):
    queryset = Header.objects.all()
    serializer_class = HeaderModelSerializer


class MoneyAccountModelViewSet(ModelViewSet):
    queryset = MoneyAccount.objects.all()
    serializer_class = MoneyAccountModelSerializer


class CategoryModelViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer


class SubcategoryModelViewSet(ReadOnlyModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategoryModelSerializer


class TransactionModelViewSet(ModelViewSet):
    queryset = Transaction.objects. \
        select_related('header', 'category', 'subcategory', 'account', 'plain_id'). \
        order_by('operation_date', '-updated')
    filterset_class = DateFilter
    serializer_class = TransactionModelSerializer

    def list(self, request):
        header = request.GET.get('last_header', None)
        transaction_id = request.GET.get('transaction_id', None)
        transfer_id = request.GET.get('transfer_id', None)
        plain_id = request.GET.get('plain_id', None)
        last20 = request.GET.get('last20', None)
        filter = request.GET.get('filter', None)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = TransactionModelListSerializer(queryset, many=True)
        if header:
            queryset = Transaction.objects.filter(header__name=header, past=0).order_by('-operation_date').first()
            serializer = TransactionModelListSerializer(queryset)
        if transaction_id:
            queryset = Transaction.objects.get(pk=transaction_id)
            serializer = TransactionModelListSerializer(queryset)
        if transfer_id:
            queryset = Transaction.objects.filter(transfer_id=transfer_id)
            serializer = TransactionModelListSerializer(queryset, many=True)
        if plain_id:
            first_transaction = (Transaction.objects.filter(plain_id=plain_id).order_by('operation_date')).first().pk
            last_transaction = (Transaction.objects.filter(plain_id=plain_id).order_by('operation_date')).last().pk
            plain_transactions_list = [first_transaction, last_transaction]
            queryset = Transaction.objects.filter(pk__in=plain_transactions_list).order_by('operation_date')
            serializer = TransactionModelListSerializer(queryset, many=True)
        if last20:
            queryset = Transaction.objects.all().order_by('-updated')[:20]
            serializer = TransactionModelListSerializer(queryset, many=True)
        if filter:
            filter_header = request.GET.get('filterHeader', None)
            filter_category = request.GET.get('filterCategory', None)
            filter_subcategory = request.GET.get('filterSubcategory', None)
            start = request.GET.get('start', None)
            end = request.GET.get('end', None)
            headers = []
            categories = []
            subcategories = []
            if filter_header == '':
                headers = Header.objects.values_list('name')
            else:
                headers.append(filter_header)
            if filter_category == '':
                categories = Category.objects.values_list('name')
            else:
                categories.append(filter_category)
            if filter_subcategory == '':
                subcategories = Subcategory.objects.values_list('name')
            else:
                subcategories.append(filter_subcategory)
            queryset = Transaction.objects.filter(header__name__in=headers,
                                                  category__name__in=categories,
                                                  subcategory__name__in=subcategories,
                                                  past=0,
                                                  operation_date__range=(start, end)). \
                order_by('operation_date').all()
            serializer = TransactionModelListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['delete'], detail=False)
    def delete(self, request):
        transfer_id = request.GET.get('transfer_id', None)
        plain_id = request.GET.get('plain_id', None)
        if transfer_id:
            queryset = Transaction.objects.filter(transfer_id=transfer_id)
            queryset.delete()
        if plain_id:
            queryset = Transaction.objects.filter(plain_id=plain_id)
            queryset.delete()
        return Response()

    def get_serializer_class(self):
        if self.action == 'list':
            return TransactionModelListSerializer
        return TransactionModelSerializer


class MoneyAccountListViewSet(ReadOnlyModelViewSet):
    queryset = MaInfo.objects.all()
    serializer_class = MoneyAccountListModelSerializer


class TotalBalanceModelViewSet(ModelViewSet):
    queryset = TotalBalance.objects.values_list('operation_date', 'total', 'case')
    serializer_class = TotalBalanceModelSerializer
    filterset_class = DateFilter

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        out_qs = [{'operation_date': el[0], 'total': el[1], 'day': el[2]} for el in queryset]
        return Response(out_qs)


class TotalBalancePerAccountModelViewSet(ModelViewSet):
    queryset = TotalBalancePerAccount.objects.values_list('account', 'operation_date', 'total', 'case')
    serializer_class = TotalBalancePerAccountModelSerializer
    filterset_class = DateFilter

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        out_qs = [{'account': el[0], 'operation_date': el[1], 'total': el[2], 'day': el[3]} for el in queryset]
        return Response(out_qs)


# class LastHeadersModelViewSet(ModelViewSet):
#     queryset = LastHeaders.objects.values_list('header', 'category', 'subcategory')
#     serializer_class = LastHeadersModelSerializer
#
#     def list(self, request, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())
#         out_qs = [{'header': el[0], 'category': el[1], 'subcategory': el[2]} for el in queryset]
#         return Response(out_qs)


class PlainOperationModelViewSet(ModelViewSet):
    queryset = PlainOperation.objects. \
        select_related('header', 'category', 'subcategory'). \
        order_by('-pk')
    serializer_class = PlainOperationModelSerializer

    def list(self, request):
        qs = []
        queryset_element = {}
        for el in self.queryset:
            transactions_array = Transaction.objects.filter(plain_id=el.id).order_by('operation_date')
            if len(transactions_array) != 0:
                queryset_element['id'] = el.pk
                queryset_element['header'] = el.header
                queryset_element['category'] = el.category
                queryset_element['subcategory'] = el.subcategory
                queryset_element['summ'] = el.operation_summ
                queryset_element['curr_date'] = transactions_array.first().operation_date
                queryset_element['end_date'] = transactions_array.last().operation_date
                queryset_element['disabled'] = False
                qs.append(queryset_element)
            queryset_element = {}
        serializer = PlainOperationModelListSerializer(qs, many=True)
        return Response(serializer.data)


class ReportViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = ReportSerializer

    def list(self, request):
        category = request.GET.get('category', None)
        start_date = request.GET.get('start', None)
        end_date = request.GET.get('end', None)
        qs = Transaction.objects. \
            filter(category__name=category, past=0, operation_date__range=(start_date, end_date)). \
            values('operation_date').annotate(total_summ=Sum('operation_summ'))
        return Response(qs)


class StatisticViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = StatisticSerializer

    def list(self, request):
        category = request.GET.get('category', None)
        start_date = request.GET.get('start', None)
        end_date = request.GET.get('end', None)
        if category:
            qs = Transaction.objects.filter(category__name=category, past=0,
                                            operation_date__range=(start_date, end_date)). \
                values('category__name', 'subcategory__name'). \
                annotate(total_summ=Sum('operation_summ')).order_by('category__name', 'total_summ')
        else:
            qs = Transaction.objects.filter(past=0, operation_date__range=(start_date, end_date)). \
                values('category__name', 'subcategory__name'). \
                annotate(total_summ=Sum('operation_summ')).order_by('category__name', 'total_summ')
        return Response(qs)


class BudgetModelViewSet(ModelViewSet):
    queryset = BudgetPeriod.objects.all()
    serializer_class = BudgetModelSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return BudgetModelListSerializer
        return BudgetModelSerializer


class BudgetDetailModelViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = BudgetDetailSerializer

    def list(self, request):
        category = request.GET.get('category', None)
        start_date = request.GET.get('start', None)
        end_date = request.GET.get('end', None)
        plain_summ = int(request.GET.get('summ', None).split('.')[0])
        start_day = datetime.strptime(start_date, '%Y-%m-%d')
        end_day = datetime.strptime(end_date, '%Y-%m-%d')
        result = []
        result_part = []
        list_of_budget = []
        budget_summ = 0
        anchor = False
        while start_day <= end_day:
            result_part.append(start_day.strftime('%Y-%m-%d'))
            if start_day.strftime('%A') == 'Sunday':
                result.append(result_part)
                result_part = []
            start_day = start_day + timedelta(days=1)
        if len(result_part) != 0:
            result.append(result_part)

        for el in result:
            if datetime.today().strftime('%Y-%m-%d') in el:
                anchor = True

            articles_summ = Transaction.objects. \
                filter(category__name=category, operation_date__in=el, past=0).aggregate(Sum('operation_summ'))

            if articles_summ['operation_summ__sum']:
                appended_digit = float(articles_summ['operation_summ__sum'])
            else:
                appended_digit = 0
            weekly_budget = [budget_summ, plain_summ, appended_digit,
                             round((budget_summ + plain_summ + appended_digit), 2),
                             el[0], el[-1], anchor]
            list_of_budget.append(weekly_budget)
            budget_summ = round((budget_summ + plain_summ + appended_digit), 2)
            anchor = False

        return Response(list_of_budget)
