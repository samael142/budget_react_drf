from rest_framework.serializers import ModelSerializer
from budget.models import Header, Category, Subcategory
from transactionapp.models import Transaction, TotalBalance, TotalBalancePerAccount
from maapp.models import MaInfo, MoneyAccount


class HeaderModelSerializer(ModelSerializer):
    class Meta:
        model = Header
        fields = ['name']


class CategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class SubcategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ['name']


class TransactionModelSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class MoneyAccountListModelSerializer(ModelSerializer):
    class Meta:
        model = MaInfo
        fields = '__all__'


class MoneyAccountModelSerializer(ModelSerializer):
    class Meta:
        model = MoneyAccount
        fields = ['name']


class TransactionModelListSerializer(ModelSerializer):
    header = HeaderModelSerializer()
    category = CategoryModelSerializer()
    subcategory = SubcategoryModelSerializer()
    account = MoneyAccountModelSerializer()

    class Meta:
        model = Transaction
        exclude = ['created', 'updated']


class TotalBalanceModelSerializer(ModelSerializer):
    class Meta:
        model = TotalBalance
        fields = ['operation_date', 'total', 'case']
