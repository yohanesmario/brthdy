# BRTHDY

## Setup

### Docker network

Run this:

```bash
docker network create brthdy
```

### MySQL

- Run a MySQL server:
  ```bash
  # This assumes you have docker installed
  docker run \
    -d \
    -p 3306:3306 \
    -v $HOME/mysqldata/brthdy:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=12345678 \
    --name mysql-brthdy \
    --net brthdy \
    mysql:8.0.26
  ```
- Login to MySQL:
  ```bash
  mysql --host=localhost --port=3306 --protocol=TCP --user=root --password=12345678
  ```
- Create a database called `brthdy`:
  ```sql
  CREATE DATABASE `brthdy`;
  ```
- Create a user called `brthdy` with password: `brthdy`:
  ```sql
  CREATE USER `brthdy`@'%' IDENTIFIED BY 'brthdy';
  ```
- Grant all privileges on the database to the user:
  ```sql
  GRANT ALL PRIVILEGES ON `brthdy`.* TO `brthdy`;
  ```
- Do migration:
  ```bash
  npm install
  npm run migration:run
  ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migration

```bash
# generate migration
$ npm run migration:generate

# run migration
$ npm run migration:run
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

On localhost, go to `http://localhost:{PORT}/api`. Default port is 3000.
