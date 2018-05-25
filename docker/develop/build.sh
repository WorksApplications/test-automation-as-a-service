#!/bin/bash -exu

#====
# To build and push to registry
# To use this script, you need a variable FTP
# Ex:
# $ export FTP:='ftp://qe:jiu_bu_gao_su_ni@172.26.142.112'
# $ /path/to/this/directory/build.sh
#====

export here=$(cd $(dirname "${0}"); pwd)
export HOME

bash ${here}/fetch_dev_config.sh

${here}/../images/prepare_for_build.sh

: ${API_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/webservice'}
: ${NGINX_IMAGE_TAG:='shanghaiqe.internal.worksap.com:6161/taas/nginx'}

# export IMAGE_TAG="dev_$(date -u +"%Y-%m-%d-%H-%M-%S")_$(git rev-parse HEAD)"
export IMAGE_TAG="dev_$(git rev-parse HEAD)"
export API_IMAGE_TAG
export NGINX_IMAGE_TAG

# build images
config_file="-f ${here}/../images/docker-compose.yml -f ${here}/docker-compose.dev.yml"
docker-compose ${config_file} build ${@}
docker-compose ${config_file} push ${@}
unset config_file

# remove unused caches
docker rmi $(docker images -f "dangling=true" -q) || true

