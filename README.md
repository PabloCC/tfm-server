# TFM SERVER

## Description

REST API to manage different resources for early childhood education centers. This application is included in the master's thesis "Agenda digital para centros educativos de educación infantil". A connection to a PostgreSQL database is made.
## Installation

```bash
$ npm install
```
## Setup local environment

To setup a local database in a docker container, run:

```bash
$ docker-compose up -d
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
