from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from budget.models import Category
from transactionapp.models import Transaction


class ReportViewSetTests(APITestCase):
    def test_report_includes_dates_without_transactions(self):
        category = Category.objects.create(name='Food')
        user = get_user_model().objects.create_user(username='report-test')
        self.client.force_authenticate(user=user)
        Transaction.objects.create(
            category=category,
            operation_date=date(2026, 11, 9),
            operation_summ=Decimal('-5.00'),
        )
        Transaction.objects.create(
            category=category,
            operation_date=date(2026, 11, 11),
            operation_summ=Decimal('-3.00'),
        )

        response = self.client.get('/api/report/', {
            'category': 'Food',
            'start': '2026-11-09',
            'end': '2026-11-11',
        })

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(
            [row['operation_date'] for row in report],
            ['2026-11-09', '2026-11-10', '2026-11-11'],
        )
        self.assertEqual(
            [Decimal(row['total_summ']) for row in report],
            [Decimal('-5.00'), Decimal('0.00'), Decimal('-3.00')],
        )
