#!/usr/bin/env bash

set -e

whoami

echo "**** install Python ****"
apt-get update
apt-get -y install python3 curl

echo "**** Setting up symlink: /usr/bin/python -> python3 ****"
if [ ! -e /usr/bin/python ]; then
  ln -sf python3 /usr/bin/python
fi

echo "**** install pip ****"
python3 -m ensurepip || echo "[WARNING] No module named ensurepip. Ignoring and moving forward."
rm -r /usr/lib/python*/ensurepip || echo "[WARNING] /usr/lib/python*/ensurepip is not present. Ignoring and moving forward."

echo "**** downloading the bundle from bootstrap.pypa.io ****"
curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py
python /tmp/get-pip.py
rm /tmp/get-pip.py

echo "pip: $(which pip)"
echo "pip3: $(which pip3)"

#if [ ! -e /usr/bin/pip ] || [ ! -h /usr/bin/pip ]; then
#  echo "**** Pointing /usr/bin/pip -> pip3"
#  ln -s pip3 /usr/bin/pip
#else
#  echo "**** Skipping symlink creating for PIP ****"
#fi
