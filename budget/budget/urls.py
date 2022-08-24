"""budget URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
import api.views as api

router = DefaultRouter()
router.register('headers', api.HeaderModelViewSet)
router.register('categories', api.CategoryModelViewSet)
router.register('subcategories', api.SubcategoryModelViewSet)
router.register('transactions', api.TransactionModelViewSet)
router.register('ma_list', api.MoneyAccountListViewSet)
router.register('total_balance', api.TotalBalanceModelViewSet)
router.register('total_balance_per_account', api.TotalBalancePerAccountModelViewSet)
router.register('plain_operations', api.PlainOperationModelViewSet)
router.register('money_accounts', api.MoneyAccountModelViewSet)
router.register('report', api.ReportViewSet)
router.register('statistic', api.StatisticViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('transactionapp/', include('transactionapp.urls', namespace='transactions')),
    path('maapp/', include('maapp.urls', namespace='money_accounts')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('report/', ReportView.as_view(), name='report'),
    path('generated_report/', GeneratedReportView.as_view(), name='generated_report'),
    path('generated_report/<date>', DetailReportView.as_view(), name='detail_report'),
    path('settings', SettingsView.as_view(), name='settings'),
    path('settings/statistic/', StatisticView.as_view(), name='statistic'),
    path('settings/filter/', FilterSettingsView.as_view(), name='filter'),
    path('settings/generated_filter/', GeneratedFilterView.as_view(), name='generated_filter'),
    path('settings/last20/', Last20View.as_view(), name='last20'),
    path('budget/budget_list/', BudgetListView.as_view(), name='budget_list'),
    path('budget/create/', BudgetCreateView.as_view(), name='budget_create'),
    path('budget/detail/<int:pk>/', BudgetDetailView.as_view(), name='budget_detail'),
    path('budget/update/<int:pk>/', BudgetEditView.as_view(), name='budget_edit'),
    path('budget/delete/<int:pk>/', BudgetDeleteView.as_view(), name='budget_delete'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    ]
