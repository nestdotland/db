echo "creating dump..."
docker run \
  --env-file .env \
  --env PGPASSWORD \
  --env PGHOST \
  --env PGUSER \
  postgres pg_dump -O -x --clean --if-exists -Z 9 \
  -n extensions \
  -n public >nest_dev.sql.gz
echo "dump created:"
ls -lh nest_dev.sql.gz
