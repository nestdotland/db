FROM postgres:13

COPY nest_db.sql.gz /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
