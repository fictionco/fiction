#!/bin/sh
set -e

if [ -z "${CLOUDFLARE_API_TOKEN}" ]; then
    echo "Error: CLOUDFLARE_API_TOKEN environment variable is required"
    exit 1
fi

mkdir -p /data/caddy

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
