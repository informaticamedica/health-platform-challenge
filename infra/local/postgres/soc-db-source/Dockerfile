FROM postgres:16

# Ejecuta los SQL del directorio /docker-entrypoint-initdb.d
COPY ./sql /docker-entrypoint-initdb.d

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /etc/postgresql/certs \
  && openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
    -subj "/CN=localhost" \
    -keyout /etc/postgresql/certs/server.key \
    -out /etc/postgresql/certs/server.crt \
  && chown postgres:postgres /etc/postgresql/certs/server.key /etc/postgresql/certs/server.crt \
  && chmod 600 /etc/postgresql/certs/server.key \
  && chmod 644 /etc/postgresql/certs/server.crt
