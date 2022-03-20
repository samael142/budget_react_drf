from django.db.models import Sum
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, reverse
from django.urls import reverse_lazy
from .models import Category, BudgetPeriod, Header, Subcategory
from django.views.generic import ListView, TemplateView, CreateView, DetailView, UpdateView, DeleteView
from transactionapp.models import Transaction
from datetime import datetime, date, timedelta


def index(request):
    current_date = datetime.now().strftime('%d-%m-%Y')
    current_year = datetime.now().strftime('%Y')
    current_month = datetime.now().strftime('%m')
    return redirect(reverse('transactions:page', kwargs={'year': current_year,
                                                         'month': current_month}) + f'#{current_date}')


class ReportView(ListView):
    # model = Category
    template_name = 'budget/report_v2.html'
    allow_empty = True
    success_url = reverse_lazy('generated_report')
    queryset = Category.objects.all().order_by('name')

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
        request.session['report_data_category'] = request.POST['category']
        # request.session['report_data_categories'] = request.POST.getlist('cat_checkbox')
        request.session.modified = True
        return HttpResponseRedirect(reverse('generated_report'))


class GeneratedReportView(ListView):
    template_name = 'budget/generated_report.html'

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.category = request.session['report_data_category']
        # self.categories = request.session['report_data_categories']
        self.start_date = request.session['report_data_start_date']
        self.end_date = request.session['report_data_end_date']
        self.summ = request.session['report_data_summ']

    def get_queryset(self):
        temp_dataset = {}
        dates_list = []
        start_day = datetime.strptime(self.start_date, '%Y-%m-%d')
        end_day = datetime.strptime(self.end_date, '%Y-%m-%d')
        while start_day <= end_day:
            dates_list.append({'operation_date': start_day.date(), 'total_summ': 0.0})
            if start_day.strftime("%Y-%m-%d") == datetime.today().strftime("%Y-%m-%d"):
                break
            start_day = start_day + timedelta(days=1)
        queryset = []
        source_queryset = Transaction.objects. \
            filter(category__name=self.category, past=0, operation_date__range=(self.start_date, self.end_date)). \
            values('operation_date').annotate(total_summ=Sum('operation_summ'))
        for el_source_queryset in source_queryset:
            temp_dataset[el_source_queryset['operation_date']] = el_source_queryset['total_summ']
        for el_dates_list in dates_list:
            el_dates_list['total_summ'] = temp_dataset.get(el_dates_list['operation_date'], 0.0)
        total_summ = 0
        for el in dates_list:
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


class SettingsView(TemplateView):
    template_name = 'budget/settings.html'


class StatisticView(ListView):
    template_name = 'budget/statistic.html'
    start_date = datetime.today().strftime('%Y-%m-%d').split("-")
    start_date[2] = '01'
    start_date = "-".join(start_date)
    end_date = datetime.today().strftime('%Y-%m-%d')

    def get_queryset(self):
        queryset = Transaction.objects.filter(past=0, operation_date__range=(self.start_date, self.end_date)). \
            values('category__name', 'subcategory__name', 'category'). \
            annotate(total_summ=Sum('operation_summ')).order_by('category__name', 'total_summ')
        return queryset

    def get_context_data(self, **kwargs):
        categories_dict = {}
        context = super().get_context_data(**kwargs)
        context['title'] = 'статистика'
        context['start_date'] = self.start_date
        context['end_date'] = self.end_date
        categories = Transaction.objects.filter(past=0, operation_date__range=(self.start_date, self.end_date)). \
            values('category__name'). \
            annotate(total_summ=Sum('operation_summ'))
        for el in categories:
            categories_dict[el['category__name']] = float(el['total_summ'])
        context['categories_dict'] = categories_dict
        return context

    def post(self, request, *args, **kwargs):
        self.start_date = request.POST['trip-start']
        self.end_date = request.POST['trip-end']
        return self.get(self, request, *args, **kwargs)


class BudgetListView(ListView):
    model = BudgetPeriod
    template_name = 'budget/budget_list.html'
    allow_empty = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        budget_dates = []
        articles = BudgetPeriod.objects.all()
        print(articles)
        for el in articles:
            budget_dates.append(str(el.start_date))
            budget_dates.append(str(el.end_date))
        context['weekdays'] = BudgetListView.get_weekdays(budget_dates)
        return context

    @staticmethod
    def get_weekdays(dates):
        dict_of_days = {}
        days = dates
        weekdays = ("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")
        for el in days:
            day = list(map(int, el.split('-')))
            dict_of_days[el] = weekdays[date(*day).weekday()]
        print(dict_of_days)
        return dict_of_days


class BudgetCreateView(CreateView):
    model = BudgetPeriod
    template_name = 'budget/budget_period.html'
    success_url = reverse_lazy('budget_list')
    fields = '__all__'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'бюджет/создание'
        context['categories'] = Category.objects.all()
        context['date'] = datetime.today().strftime('%Y-%m-%d')
        return context


class BudgetEditView(UpdateView):
    model = BudgetPeriod
    template_name = 'budget/budget_period.html'
    fields = '__all__'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'бюджет/изменение'
        context['categories'] = Category.objects.all()
        context['category'] = self.get_object().category
        return context

    def get_success_url(self):
        pk = self.kwargs['pk']
        return reverse_lazy('budget_detail', kwargs={'pk': pk})


class BudgetDeleteView(DeleteView):
    model = BudgetPeriod
    success_url = reverse_lazy('budget_list')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class BudgetDetailView(DetailView):
    model = BudgetPeriod
    template_name = 'budget/budget_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        list_of_budget = []
        budget_summ = 0
        plain_summ = int(self.get_object().plain_summ)
        start_date = str(self.get_object().start_date)
        end_date = str(self.get_object().end_date)
        category = str(self.get_object().category.pk)
        periods = BudgetDetailView.get_weeks(start_date, end_date)
        anchor_date = None
        marker = 1

        for el in periods:
            if datetime.today().strftime('%Y-%m-%d') in el:
                anchor_date = marker
            marker += 1

            articles_summ = Transaction.objects. \
                filter(category=category, operation_date__in=el, past=0).aggregate(Sum('operation_summ'))

            if articles_summ['operation_summ__sum']:
                appended_digit = float(articles_summ['operation_summ__sum'])
            else:
                appended_digit = 0
            weekly_budget = [budget_summ, plain_summ, appended_digit,
                             round((budget_summ + plain_summ + appended_digit), 2),
                             el[0], el[-1]]
            list_of_budget.append(weekly_budget)
            budget_summ = round((budget_summ + plain_summ + appended_digit), 2)

        context['articles'] = list_of_budget
        context['anchor'] = anchor_date
        return context

    @staticmethod
    def get_weeks(start_date, end_date):
        start_day = datetime.strptime(start_date, '%Y-%m-%d')
        end_day = datetime.strptime(end_date, '%Y-%m-%d')
        result = []
        result_part = []
        while start_day <= end_day:
            result_part.append(start_day.strftime('%Y-%m-%d'))
            if start_day.strftime('%A') == 'Sunday':
                result.append(result_part)
                result_part = []
            start_day = start_day + timedelta(days=1)
        if len(result_part) != 0:
            result.append(result_part)
        return result


class FilterSettingsView(TemplateView):
    template_name = 'budget/filter_settings_v2.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['headers'] = Header.objects.all().order_by('name')
        context['categories'] = Category.objects.all().order_by('name')
        context['subcategories'] = Subcategory.objects.all().order_by('name')
        context['dates'] = ReportView.get_current_week()
        return context

    def post(self, request, **kwargs):
        request.session['filter_data_start_date'] = request.POST['trip-start']
        request.session['filter_data_end_date'] = request.POST['trip-end']
        # request.session['filter_data_headers'] = request.POST.getlist('header_checkbox')
        # request.session['filter_data_categories'] = request.POST.getlist('cat_checkbox')
        # request.session['filter_data_subcategories'] = request.POST.getlist('subcat_checkbox')
        request.session['filter_data_header'] = request.POST['header']
        request.session['filter_data_category'] = request.POST['category']
        request.session['filter_data_subcategory'] = request.POST['subcategory']
        request.session.modified = True
        return HttpResponseRedirect(reverse('generated_filter'))


class GeneratedFilterView(ListView):
    template_name = 'transactionapp/transactions.html'

    def setup(self, request, *args, **kwargs):
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.start_date = request.session['filter_data_start_date']
        self.end_date = request.session['filter_data_end_date']
        # self.headers = request.session['filter_data_headers']
        # self.categories = request.session['filter_data_categories']
        # self.subcategories = request.session['filter_data_subcategories']
        self.header = request.session['filter_data_header']
        self.category = request.session['filter_data_category']
        self.subcategory = request.session['filter_data_subcategory']

    def get_queryset(self):
        headers = []
        categories = []
        subcategories = []
        if self.header == '':
            headers = Header.objects.values_list('name')
        else:
            headers.append(self.header)
        if self.category == '':
            categories = Category.objects.values_list('name')
        else:
            categories.append(self.category)
        if self.subcategory == '':
            subcategories = Subcategory.objects.values_list('name')
        else:
            subcategories.append(self.subcategory)

        queryset = Transaction.objects.filter(header__name__in=headers,
                                              category__name__in=categories,
                                              subcategory__name__in=subcategories,
                                              past=0,
                                              operation_date__range=(self.start_date, self.end_date)). \
            order_by('operation_date').all()
        return queryset


class Last20View(ListView):
    template_name = 'transactionapp/transactions.html'

    def get_queryset(self):
        queryset = Transaction.objects.all().order_by('-updated')[:20]
        return queryset
