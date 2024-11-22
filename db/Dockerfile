FROM mysql:8

ENV MYSQL_DATABASE=db_leovegas \
    MYSQL_ROOT_PASSWORD=db_leovegas

ADD SQL_DB.sql /docker-entrypoint-initdb.d

EXPOSE 3306
