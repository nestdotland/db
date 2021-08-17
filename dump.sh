docker pull postgres:alpine

echo "creating dump..."
docker run \
  --env PGPASSWORD \
  --env PGHOST \
  --env PGUSER=postgres \
  postgres:alpine pg_dump -O -x --clean --if-exists -Z 9 \
  -n public >nest_dev.sql.gz
echo "dump created:"

ls -lh nest_dev.sql.gz
