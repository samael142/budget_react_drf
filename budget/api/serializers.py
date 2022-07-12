from rest_framework.serializers import ModelSerializer, CharField
from budget.models import Header, Category, Subcategory, LastHeaders
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
    header = CharField()
    category = CharField()
    subcategory = CharField()

    def create(self, validated_data):
        header = validated_data.pop('header')
        category = validated_data.pop('category')
        subcategory = validated_data.pop('subcategory')
        header_instance, created = Header.objects.get_or_create(name=header)
        category_instance, created = Category.objects.get_or_create(name=category)
        subcategory_instance, created = Subcategory.objects.get_or_create(name=subcategory)
        transaction_instance = Transaction.objects.create(**validated_data,
                                                          header=header_instance,
                                                          category=category_instance,
                                                          subcategory=subcategory_instance)
        return transaction_instance

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


class LastHeadersModelSerializer(ModelSerializer):
    class Meta:
        model = LastHeaders
        fields = ['header', 'category', 'subcategory']
