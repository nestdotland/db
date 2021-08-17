FROM postgres:alpine
COPY nest_dev.sql.gz /docker-entrypoint-initdb.d/
ENV POSTGRES_DB=nest
ENV POSTGRES_USER=nest
ENV POSTGRES_PASSWORD=nest
