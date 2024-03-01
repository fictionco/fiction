#!/usr/bin/env bash
# Exit on error and enable pipefail option
set -eo pipefail
# Enable trace mode if the TRACE variable is set
[[ $TRACE ]] && set -x

# Get the parent directory of the parent directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PARENT_PARENT_DIR="$(dirname "${SCRIPT_DIR}")"

# Create xcache directory
sudo mkdir -p "${PARENT_PARENT_DIR}/xcache"

# Source environment variables from .env file
# shellcheck disable=SC1091
source "${PARENT_PARENT_DIR}/.env"

# Format JuiceFS with the specified options
juicefs format \
  --storage s3 \
  --bucket https://fiction-fs.s3.us-west-2.amazonaws.com \
  --access-key "${AWS_ACCESS_KEY}" \
  --secret-key "${AWS_ACCESS_KEY_SECRET}" \
  "${XCACHE_REDIS_URL}" \
  xcache

sudo juicefs mount "${XCACHE_REDIS_URL}" "${PARENT_PARENT_DIR}/xcache"
