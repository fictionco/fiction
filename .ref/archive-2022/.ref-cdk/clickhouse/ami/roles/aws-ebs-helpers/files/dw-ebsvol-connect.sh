#!/usr/bin/env bash

exec > >(tee >(log -p local0.notice -t $(basename "$0")))
exec 2> >(tee >&2 >(log -p local0.error -t $(basename "$0")))

MY_ID=$(wget -q -O - http://169.254.169.254/latest/meta-data/instance-id)
VOL_ID=$1
DEVICE_ID=$2
COUNT=0
ATTEMPTS=30

# There could be a race-condition when during the short period of time
# could be an "old" and the "new" EC2 instance. An old one holds EC2
# volume in attached state, while the new machine wants to attach it.

function attach_vol() {
    local MY_ID=$1
    local VOL_ID=$2
    local DEVICE_ID=$3

    echo "$(date): Mounting ${VOL_ID} to ${MY_ID}:${DEVICE_ID}"
    aws ec2 attach-volume --volume-id ${VOL_ID} --instance-id ${MY_ID} --device ${DEVICE_ID}

    return $?
}

function detach_vol() {
    local VOL_ID=$1
    local PARAMS=$2

    echo "$(date): Detaching ${VOL_ID} ${PARAMS}"
    aws ec2 detach-volume --volume-id ${VOL_ID} ${PARAMS}
}

if [ -z $1 ] || [ -z $2 ]; then
    echo "$(date): I have no idea which volume ID to mount. Device probably is empty as well"
    exit 1
else
    while true; do
        attach_vol ${MY_ID} ${VOL_ID} ${DEVICE_ID}
        STATUS=$?

        echo "$(date): Exit status ${STATUS}"
        if [ ${STATUS} -eq 0 ]; then
            break
        else
            echo "$(date): Trying to detach the volume (count: ${COUNT})"
            if [ ${COUNT} -gt ${ATTEMPTS} ]; then
                PARAMS="--force"
            else
                PARAMS=""
            fi
            detach_vol ${VOL_ID} ${PARAMS}
        fi
        sleep 5
        ((COUNT++))
    done

fi
