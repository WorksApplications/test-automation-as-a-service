#!/bin/bash -x

export here=$(cd $(dirname "${0}"); pwd)
export FTP=ftp://qe:***@taas-develop.internal.worksap.com

# provided by Jenkins
: {$WORKSPACE:=/home/li_t/taas-data/jenkins/home/workspace/api-test}

export HOME
export UID
export WORKSPACE
echo $UID
echo $WORKSPACE

bash ${here}/fetch_test_config.sh
${here}/../images/prepare_for_test.sh

project_name="--project-name taas-test"
config_file="-f ${here}/../images/docker-compose.yml -f ${here}/docker-compose.api-test.yml"
params="${project_name} ${config_file} "

docker-compose ${params} up -d mongodb hub chrome-01 chrome-01-live chrome-02 chrome-02-live chrome-03 chrome-03-live
docker-compose ${params} build api
cp -r ${here}/../images/webservice ${here}/
docker-compose ${params} run api npm test
docker-compose ${params} down

unset config_file
unset project_name
unset params

#===================
# Judge test result
#===================
has_failure=$(grep '"failures": 0,' < ${WORKSPACE}/reports/backend-test/index.json)

if [ -z "${has_failure}" ]; then
    echo 'TEST FAIL'
    exit 1
else
    echo 'TEST SUCCESS'
fi
