docker run -d --rm \
  --name db_dump \
  --publish 5432:5432 \
  --env POSTGRES_PASSWORD=postgres \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_DB=postgres \
  postgres:13

sleep 30

export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

yarn push
yarn seed

docker exec \
  --env PGHOST=localhost \
  --env PGUSER=postgres \
  --env PGPASSWORD=postgres \
  db_dump pg_dump -O -x --clean --if-exists -Z 9 \
  -n public >nest_db.sql.gz

ls -lh nest_db.sql.gz

docker stop db_dump
