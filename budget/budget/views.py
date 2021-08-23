from django.db.models import Sum
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, reverse
from datetime import datetime, timedelta

from django.urls import reverse_lazy

from .models import Category

from django.views.generic import ListView
from transactionapp.models import Transaction


def index(request):
    current_date = datetime.now().strftime('%d-%m-%Y')
    current_year = datetime.now().strftime('%Y')
    current_month = datetime.now().strftime('%m')
    return redirect(reverse('transactions:page', kwargs={'year': current_year,
                                                         'month': current_month}) + f'#{current_date}')


class ReportView(ListView):
    model = Category
    template_name = 'budget/report.html'
    allow_empty = True
    success_url = reverse_lazy('generated_report')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'отчёт'
        # context['objects'] = Category.objects.all()
        context['start_date'] = self.get_current_week()[0]
        context['end_date'] = self.get_current_week()[1]
        return context

    @staticmethod
    def get_current_week():
        day = datetime.today()
        while day.strftime('%A') != 'Monday':
            day -= timedelta(days=1)
        start_day = day
        end_day = day + timedelta(days=6)
        return start_day.strftime('%Y-%m-%d'), end_day.strftime('%Y-%m-%d')

    def post(self, request, **kwargs):
        request.session['report_data_start_date'] = request.POST['trip-start']
        request.session['report_data_end_date'] = request.POST['trip-end']
        request.session['report_data_summ'] = request.POST['summ']
        request.session['report_data_categories'] = request.POST.getlist('cat_checkbox')
        request.session.modified = True
        return HttpResponseRedirect(reverse('generated_report'))


class GeneratedReportView(ListView):
    template_name = 'budget/generated_report.html'

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.categories = request.session['report_data_categories']
        self.start_date = request.session['report_data_start_date']
        self.end_date = request.session['report_data_end_date']
        self.summ = request.session['report_data_summ']

    def get_queryset(self):
        queryset = []
        source_queryset = Transaction.objects. \
            filter(category__in=self.categories, past=0, operation_date__range=(self.start_date, self.end_date)). \
            values('operation_date').annotate(total_summ=Sum('operation_summ'))
        total_summ = 0
        for el in source_queryset:
            total_summ += round((float(self.summ) + float(el['total_summ'])), 2)
            el['economy'] = round((float(self.summ) + float(el['total_summ'])), 2)
            el['total_economy'] = round(total_summ, 2)
            queryset.append(el)
        return queryset


class DetailReportView(ListView):
    template_name = 'budget/detail_report.html'

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.categories = request.session['report_data_categories']

    def get_queryset(self):
        queryset = Transaction.objects.filter(operation_date=self.kwargs['date'], category__in=self.categories, past=0)
        return queryset
