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
from django.urls import path
from .views import *

app_name = 'transactionapp'

urlpatterns = [
    path('create/', TransactionCreateView.as_view(), name='transaction_create'),
    path('update/<int:pk>/', TransactionUpdateView.as_view(), name='transaction_update'),
    path('delete/<int:pk>/', TransactionDeleteView.as_view(), name='transaction_delete'),
    path('autoform/<header_name>/', TransactionCreateView.transaction_autoform, name='tr_autoform'),
    path('', TransactionsListView.as_view(), name='transactions'),
    path('<int:year>/<int:month>/', TransactionsListView.as_view(), name='page'),
    path('transfer/creat/e', TransferCreateView.as_view(), name='transfer_create'),
    path('transfer/update/<int:transfer_id>/', TransferUpdateView.as_view(), name='transfer_update'),
    path('transfer/delete/<int:transfer_id>/', TransferDeleteView.as_view(), name='transfer_delete'),
    path('plainoperations/', PlainOperationsListView.as_view(), name='plain_operations'),
    path('plainoperations/update/<int:pk>/', PlainOperationUpdateView.as_view(), name='plain_operation_update'),
    path('plainoperations/delete/<int:pk>/', PlainOperationDeleteView.as_view(), name='plain_operation_delete'),
]
