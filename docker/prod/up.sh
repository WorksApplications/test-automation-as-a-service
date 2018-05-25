#!/bin/bash

export here=$(cd $(dirname "${0}"); pwd)
export HOME

: ${API_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/webservice'}
: ${NGINX_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/nginx'}
: ${IMAGE_TAG:="prod_$(git rev-parse HEAD)"}

export API_IMAGE_TAG
export NGINX_IMAGE_TAG
export IMAGE_TAG

# if the script does not exist, pull it 
if [[ "$(docker images -q ${API_IMAGE_TAG}:${IMAGE_TAG} 2> /dev/null)" == "" ]]; then
  echo "API image not exist, pulling from registry"
  docker pull ${API_IMAGE_TAG}:${IMAGE_TAG}
  if [[ $? != 0 ]]; then
    echo "failed to pull image ${API_IMAGE_TAG}:${IMAGE_TAG}"
    exit $?
  fi
fi
if [[ "$(docker images -q ${NGINX_IMAGE_TAG}:${IMAGE_TAG} 2> /dev/null)" == "" ]]; then
  echo "nginx image not exist, pulling from registry"
  docker pull ${NGINX_IMAGE_TAG}:${IMAGE_TAG}
  if [[ $? != 0 ]]; then
    echo "failed to pull image ${NGINX_IMAGE_TAG}:${IMAGE_TAG}"
    exit $?
  fi
fi

config_file="-f ${here}/../images/docker-compose.yml -f ${here}/docker-compose.prod.yml"

docker-compose --project-name taas-prod ${config_file} up -d ${@}

unset config_file
