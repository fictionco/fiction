#!/bin/bash

# Copyright (C) 2006-2014 Amazon.com, Inc. or its affiliates.
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
#    http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is
# distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
# OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the
# License.

# Maintain consistent naming scheme with current EC2 instances
if [ "$#" -ne 1 ] ; then
  echo "$0 <device>" >&2
  exit 1
else
  if echo "$1"|grep -qE 'xvd[a-z][0-9]?' ; then
    echo "$1" | sed -e 's/xvd/sd/'
  else
    echo "$1"
  fi
fi
