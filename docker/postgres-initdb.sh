#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER factor_admin WITH PASSWORD dev;
    CREATE DATABASE factor;
    GRANT ALL PRIVILEGES ON DATABASE factor TO factor_admin;
EOSQL
