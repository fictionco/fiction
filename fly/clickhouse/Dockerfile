FROM clickhouse/clickhouse-server:latest

# Install essential debugging tools
RUN apt-get update && apt-get install -y \
    net-tools \
    procps \
    curl \
    wget \
    vim \
    htop \
    dnsutils \
    iproute2 \
    telnet \
    lsof \
    && rm -rf /var/lib/apt/lists/*

COPY ./fly/clickhouse/config.xml /etc/clickhouse-server/config.d/config.xml
COPY ./fly/clickhouse/users.xml /etc/clickhouse-server/users.d/users.xml
RUN chown -R clickhouse:clickhouse /etc/clickhouse-server/config.d/ && \
    chown -R clickhouse:clickhouse /etc/clickhouse-server/users.d/

EXPOSE 8123 9000
