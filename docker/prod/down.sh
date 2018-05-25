#!/bin/bash

export here=$(cd $(dirname "${0}"); pwd)
export HOME

: ${API_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/webservice'}
: ${NGINX_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/nginx'}
: ${IMAGE_TAG:="prod_$(git rev-parse HEAD)"}

export API_IMAGE_TAG
export NGINX_IMAGE_TAG
export IMAGE_TAG

config_file="-f ${here}/../images/docker-compose.yml -f ${here}/docker-compose.prod.yml"

docker-compose --project-name taas-prod ${config_file} down ${@}

unset config_file
