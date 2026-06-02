FROM postgres:16

COPY ./sql/ /docker-entrypoint-initdb.d/
COPY ./seed/default/ /docker-entrypoint-initdb.d/
