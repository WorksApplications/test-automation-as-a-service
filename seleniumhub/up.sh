#!/bin/bash -exu

export here=$(cd $(dirname "${0}"); pwd)

#=============================
#
# Default/needed parameters
# You can override it in with Jenkins parameters 
#
#=============================
: ${WINDOWS_VNC:=172.26.142.96:5900}

export WINDOWS_VNC

docker-compose --project-name seleniumhub \
    -f ${here}/docker-compose.yml \
    up -d ${@}
