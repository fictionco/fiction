FROM ghcr.io/caddybuilds/caddy-cloudflare:alpine

COPY ./fly/proxy/Caddyfile /etc/caddy/Caddyfile
COPY ./fly/proxy/entry.sh /entry.sh

RUN mkdir -p /data/caddy && \
    chmod +x /entry.sh

ENTRYPOINT ["/entry.sh"]
