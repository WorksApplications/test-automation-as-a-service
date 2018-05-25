#!/bin/bash -exu

: ${BUILD_NUMBER:='123'}

here=$(cd $(dirname "${0}"); pwd)

# image folder
webservice_dir=${here}/webservice
nginx_dir=${here}/nginx


function add_build_info() {
    local back_end_sysinfo=${webservice_dir}/back-end/sysinfo.json
    sed -i "s/\"commit\".*/\"commit\": \"`git rev-parse HEAD`\",/g" ${back_end_sysinfo}
    sed -i "s/\"buildNum\".*/\"buildNum\": \"${BUILD_NUMBER}\",/g" ${back_end_sysinfo}
    sed -i "s/\"buildDate\".*/\"buildDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"/g" ${back_end_sysinfo}

    local front_end_sysinfo=${nginx_dir}/portal/static/sysinfo.json
    sed -i "s/\"commit\".*/\"commit\": \"`git rev-parse HEAD`\",/g" ${front_end_sysinfo}
    sed -i "s/\"buildNum\".*/\"buildNum\": \"${BUILD_NUMBER}\",/g" ${front_end_sysinfo}
    sed -i "s/\"buildDate\".*/\"buildDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"/g" ${front_end_sysinfo}
}

#=====================
# copy needed file
#=====================
function node_build(){
    # front end
    local front_end_dir=${here}/../../front-end
    cd ${front_end_dir} &&\
        npm install &&\
        npm run build

    rm -rf ${nginx_dir}/portal
    cp -r ${front_end_dir}/dist ${nginx_dir}/portal
    cp -r ${front_end_dir}/static ${nginx_dir}/portal/

    # back end
        local back_end_dir=${here}/../../back-end
    cd ${back_end_dir} &&\
        npm install

    rm -rf ${webservice_dir}/back-end
    cp -r ${back_end_dir} ${webservice_dir}/back-end
}

node_build
add_build_info
