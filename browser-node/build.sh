#!/bin/bash -exu

export here=$(cd $(dirname "${0}"); pwd)

if [[ $(docker network ls | grep dynamic-node-net) ]]
then
    docker network rm dynamic-node-net
fi

docker network create -d bridge --subnet=192.168.55.0/24 dynamic-node-net

docker-compose \
    -f ${here}/docker-compose.yml \
    build --no-cache ${@}
