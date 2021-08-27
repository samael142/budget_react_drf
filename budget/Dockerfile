FROM python:3.9


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TZ Europe/Moscow

RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat


COPY requirements.txt /
RUN pip install -r requirements.txt
RUN pip install gunicorn
ADD . /app
WORKDIR /app
COPY ../budget /
COPY entrypoint.sh /
RUN chmod a+x ./entrypoint.sh


ENTRYPOINT ["./entrypoint.sh"]
