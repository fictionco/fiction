#!/usr/bin/env bash

set -e

CLOUDINIT=$(which cloud-init)

if [ -e "${CLOUDINIT}" ]; then
    echo "**** Cleaning cloud-init stuff ****"
    ${CLOUDINIT} clean --logs || true
else
    echo "**** Cloud-init is not found ****"
fi
