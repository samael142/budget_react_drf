from django.shortcuts import redirect, reverse
from datetime import datetime


def index(request):
    current_date = datetime.now().strftime('%d-%m-%Y')
    current_year = datetime.now().strftime('%Y')
    current_month = datetime.now().strftime('%m')
    return redirect(reverse('transactions:page', kwargs={'year': current_year,
                                                         'month': current_month}) + f'#{current_date}')
