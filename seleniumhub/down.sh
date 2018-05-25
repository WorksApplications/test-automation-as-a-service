#!/bin/bash -exu

export here=$(cd $(dirname "${0}"); pwd)

docker-compose --project-name seleniumhub \
    -f ${here}/docker-compose.yml \
    down

