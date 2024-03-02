# All shell scripts in 'initdb' will run automatically
# https://hub.docker.com/r/yandex/clickhouse-server/

FROM yandex/clickhouse-server
COPY clickhouse-init.sh /docker-entrypoint-initdb.d/clickhouse-init.sh
