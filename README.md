# Nest DB

This repository is used to manage Nest's DB migrations.

## Getting started

1. Set the evvironment variables

   ```sh
   cp example.env .env
   # and update the environmet variables
   ```

2. Start the Docker container

   ```sh
   docker-compose up
   ```

## Contributing

1. Install dependencies

   ```sh
   yarn install
   ```

2. Setup Environment

   ```sh
   cp example.env .env # and update the variables as needed
   ```

3. Start the container

   ```sh
   ./dump.sh
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Run Prisma Studio to view the database contents

   ```sh
   yarn studio
   ```

   Or you can use the pgweb interface on <http://localhost:8081> for advanced usage.

## License

The contents of this repository are licensed under [The MIT license](LICENSE).
