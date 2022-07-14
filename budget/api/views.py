from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .serializers import HeaderModelSerializer, \
    CategoryModelSerializer, \
    SubcategoryModelSerializer, \
    TransactionModelListSerializer, \
    TransactionModelSerializer, \
    MoneyAccountListModelSerializer, \
    TotalBalanceModelSerializer, \
    LastHeadersModelSerializer, \
    PlainOperationModelListSerializer, \
    PlainOperationModelSerializer
from budget.models import Header, Category, Subcategory, LastHeaders
from transactionapp.models import Transaction, TotalBalance, PlainOperation
from maapp.models import MaInfo
from .filters import DateFilter
import itertools


class HeaderModelViewSet(ModelViewSet):
    queryset = Header.objects.all()
    serializer_class = HeaderModelSerializer


class CategoryModelViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer


class SubcategoryModelViewSet(ReadOnlyModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategoryModelSerializer


class TransactionModelViewSet(ModelViewSet):
    queryset = Transaction.objects.\
                select_related('header', 'category', 'subcategory', 'account', 'plain_id').\
                order_by('operation_date', '-updated')
    filterset_class = DateFilter
    serializer_class = TransactionModelSerializer

    def list(self, request):
        header = request.GET.get('header', None)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = TransactionModelListSerializer(queryset, many=True)
        if header:
            queryset = Transaction.objects.filter(header__name=header, past=0).order_by('-operation_date').first()
            serializer = TransactionModelListSerializer(queryset)
        return Response(serializer.data)

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


class LastHeadersModelViewSet(ModelViewSet):
    queryset = LastHeaders.objects.values_list('header', 'category', 'subcategory')
    serializer_class = LastHeadersModelSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        out_qs = [{'header': el[0], 'category': el[1], 'subcategory': el[2]} for el in queryset]
        return Response(out_qs)


class PlainOperationModelViewSet(ModelViewSet):
    queryset = PlainOperation.objects.\
                select_related('header', 'category', 'subcategory').\
                order_by('operation_date')
    serializer_class = PlainOperationModelSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return PlainOperationModelListSerializer
        return PlainOperationModelSerializer
