#!/usr/bin/env bash

DRIVE=${1}

if [ -z ${DRIVE} ]; then
    echo "Error: Drive is not specified."
    exit 1
fi

echo "Stopping clickhouse"
systemctl stop clickhouse-server || true

echo "Waiting for device"
while [ ! -b $(readlink -f ${DRIVE}) ]; do
    echo "waiting for device ${DRIVE}"
    sleep 5
done

echo "Formatting the drive"
blkid $(readlink -f ${DRIVE}) || mkfs -t ext4 $(readlink -f ${DRIVE})
e2label $(readlink -f ${DRIVE}) CLICKHOUSE-DATA

echo "Putting into Fstab"
sed -e '/^[\/][^ \t]*[ \t]*\/var\/lib\/clickhouse[ \t]/d' /etc/fstab
grep -q ^LABEL=CLICKHOUSE-DATA /etc/fstab || echo 'LABEL=CLICKHOUSE-DATA /var/lib/clickhouse ext4 defaults,noatime,nobarrier    0  0' >>/etc/fstab

echo "Mounting"
grep -q "^$(readlink -f ${DRIVE}) /var/lib/clickhouse " /proc/mounts || mount /var/lib/clickhouse
chown -R clickhouse:clickhouse /var/lib/clickhouse

echo "Creating a magic file"
echo "# Do not delete this file, it is a condition magic file for ClickHouse systemd service." >/var/lib/clickhouse/.ec2-vol

echo "Starting Clickhouse"
systemctl start clickhouse-server || true

echo "All is set."
