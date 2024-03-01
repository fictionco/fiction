#!/bin/bash
# To be used with the udev rule: /etc/udev/rules.d/999-aws-ebs-nvme.rules

if [[ -z nvme ]]; then
  echo "ERROR: NVME tools not installed." >> /dev/stderr
  exit 1
fi

if [[ ! -b ${1} ]]; then
  echo "ERROR: cannot find block device ${1}" >> /dev/stderr
  exit 1
fi

# capture 32 bytes at an offset of 3072 bytes from the raw-binary data
# not all block devices are extracted with /dev/ prefix
# use `xvd` prefix instead of `sd`
# remove all trailing space
nvme_link=$( \
  nvme id-ctrl --output binary "${1}" | \
  cut -c3073-3104 | \
  sed 's/^\/dev\///g'| \
  tr -d '[:space:]' \
);
echo $nvme_link;
