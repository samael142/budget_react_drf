from rest_framework.serializers import ModelSerializer, CharField
from budget.models import Header, Category, Subcategory, BudgetPeriod
from transactionapp.models import Transaction, TotalBalance, TotalBalancePerAccount, PlainOperation
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
    header = CharField(required=False)
    category = CharField(required=False)
    subcategory = CharField(required=False)

    def create(self, validated_data):
        try:
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
        except KeyError:
            transaction_instance = Transaction.objects.create(**validated_data)
        return transaction_instance

    def update(self, instance, validated_data):
        try:
            header = validated_data.pop('header')
            category = validated_data.pop('category')
            subcategory = validated_data.pop('subcategory')
            instance.header, created = Header.objects.get_or_create(name=header)
            instance.category, created = Category.objects.get_or_create(name=category)
            instance.subcategory, created = Subcategory.objects.get_or_create(name=subcategory)
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
        except KeyError:
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
        instance.save()
        return instance

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
        fields = '__all__'


class TransactionModelListSerializer(ModelSerializer):
    header = HeaderModelSerializer()
    category = CategoryModelSerializer()
    subcategory = SubcategoryModelSerializer()
    account = MoneyAccountModelSerializer()

    class Meta:
        model = Transaction
        exclude = ['created', 'updated']


class ReportSerializer(ModelSerializer):
    category = CategoryModelSerializer()
    subcategory = SubcategoryModelSerializer()

    class Meta:
        model = Transaction
        fields = ['operation_date', 'operation_summ']


class StatisticSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['category', 'subcategory', 'operation_summ']


class BudgetDetailSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['category', 'operation_date', 'operation_summ']


class PlainOperationModelListSerializer(ModelSerializer):
    header = HeaderModelSerializer()
    category = CategoryModelSerializer()
    subcategory = SubcategoryModelSerializer()

    class Meta:
        model = PlainOperation
        fields = '__all__'


class TotalBalanceModelSerializer(ModelSerializer):
    class Meta:
        model = TotalBalance
        fields = ['operation_date', 'total', 'case']


class TotalBalancePerAccountModelSerializer(ModelSerializer):
    class Meta:
        model = TotalBalancePerAccount
        fields = ['account', 'operation_date', 'total', 'case']


# class LastHeadersModelSerializer(ModelSerializer):
#     class Meta:
#         model = LastHeaders
#         fields = ['header', 'category', 'subcategory']


class PlainOperationModelSerializer(ModelSerializer):
    header = CharField(required=False)
    category = CharField(required=False)
    subcategory = CharField(required=False)

    def create(self, validated_data):
        header = validated_data.pop('header')
        category = validated_data.pop('category')
        subcategory = validated_data.pop('subcategory')
        header_instance, created = Header.objects.get_or_create(name=header)
        category_instance, created = Category.objects.get_or_create(name=category)
        subcategory_instance, created = Subcategory.objects.get_or_create(name=subcategory)
        transaction_instance = PlainOperation.objects.create(**validated_data,
                                                             header=header_instance,
                                                             category=category_instance,
                                                             subcategory=subcategory_instance)
        return transaction_instance

    class Meta:
        model = PlainOperation
        fields = '__all__'


class BudgetModelListSerializer(ModelSerializer):
    category = CategoryModelSerializer()

    class Meta:
        model = BudgetPeriod
        fields = '__all__'


class BudgetModelSerializer(ModelSerializer):
    category = CharField(required=True)

    def create(self, validated_data):
        try:
            category = validated_data.pop('category')
            category_instance = Category.objects.get(name=category)
            budget_instance = BudgetPeriod.objects.create(**validated_data, category=category_instance)
        except KeyError:
            budget_instance = BudgetPeriod.objects.create(**validated_data)
        return budget_instance

    class Meta:
        model = BudgetPeriod
        fields = '__all__'
