from django.shortcuts import render


def index(request):
    title = 'cтартовая страница'
    content = {
        'title': title
    }
    return render(request, 'budget/index.html', context=content)