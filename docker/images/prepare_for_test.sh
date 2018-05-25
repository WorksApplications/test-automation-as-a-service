#!/bin/bash -exu

: ${BUILD_NUMBER:='123'}

here=$(cd $(dirname "${0}"); pwd)

# image folder
webservice_dir=${here}/webservice


function add_build_info() {
    local back_end_sysinfo=${webservice_dir}/back-end/sysinfo.json
    sed -i "s/4294967296/${BUILD_NUMBER}/g" ${back_end_sysinfo}
    sed -i "s/1494299577280/$(($(date +%s%N)/1000000))/g" ${back_end_sysinfo}
    sed -i "s/1234567890abcdef1234567890abcdef12345678/`git rev-parse HEAD`/g" ${back_end_sysinfo}
}

#=====================
# copy needed file
#=====================
function node_build(){

    # back end
    local back_end_dir=${here}/../../back-end
    cd ${back_end_dir} &&\
        npm install

    rm -rf ${webservice_dir}/back-end
    cp -r ${back_end_dir} ${webservice_dir}/back-end
}

node_build
add_build_info
