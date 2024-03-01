#!/usr/bin/env bash

set -e

echo "**** Deleting temp files ****"
rm -rf /root/.ansible   || true
rm -rf /root/.cache/pip || true

echo "**** Deleting APT/DPKG temp files ****"
apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
