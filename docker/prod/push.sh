#!/bin/bash

export here=$(cd $(dirname "${0}"); pwd)
export HOME

config_file="-f ${here}/../images/docker-compose.yml -f ${here}/docker-compose.prod.yml"
docker-compose ${config_file} push ${@}
unset config_file
