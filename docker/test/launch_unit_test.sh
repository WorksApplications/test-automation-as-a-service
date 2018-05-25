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

curl $FTP/config.test.yml > ${here}/../../back-end/config.yml
cd ${WORKSPACE}/back-end
npm run unit-test

#===================
# Judge test result
#===================
has_failure=$(grep '"failures": 0,' < ${WORKSPACE}/reports/unit-test/backend-test/index.json)

if [ -z "${has_failure}" ]; then
    echo 'TEST FAIL'
    exit 1
else
    echo 'TEST SUCCESS'
fi
