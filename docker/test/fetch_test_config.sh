#!/bin/bash -exu

: ${FTP:='ftp://qe:jiu_bu_gao_su_ni@172.26.142.112'}
here=$(cd $(dirname "${0}"); pwd)

# data needed
back_end_dir=${here}/../../back-end
front_end_dir=${here}/../../front-end
webservice_dir=${here}/../images/webservice

curl $FTP/config.test.yml > ${back_end_dir}/config.yml
rm -rf ${webservice_dir}/ssh
wget -P ${webservice_dir}/ssh -nH -nd -np --no-parent -r $FTP/ssh