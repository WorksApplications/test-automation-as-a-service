#!/bin/bash -exu

#================
# parameters
#================
# WORKSPACE=$(cd $(dirname "${0}")/..; pwd)

user_in_docker="uid${UID}"
home_in_docker="/home/${user_in_docker}"
project_in_docker="${home_in_docker}/project"

function npm_docker(){
	echo "RUN npm"
	local image_name="foolifish07/nodejs"
	local volume_repositry="--volume=${HOME}/.npm:${home_in_docker}/.npm"
	local workspace_parameters="--volume=${WORKSPACE}:${project_in_docker}
							   --env=uid=${UID}
							   --workdir=${project_in_docker}/build-scripts/slackbot" 

	docker run --rm \
		${volume_repositry} \
		${workspace_parameters} \
		${image_name} \
		npm ${@}
}

function mvn(){
	echo "RUN mvn"
	local image_name="foolifish07/java-chromedriver"
	local volume_repositry="--volume=${HOME}/.m2:${home_in_docker}/.m2"
	local workspace_parameters="--volume=${WORKSPACE}:${project_in_docker}
							   --env=uid=${UID}" 

	docker run --rm \
		--privileged \
		-v /dev/shm:/dev/shm \
		${volume_repositry} \
		${workspace_parameters} \
		${image_name} \
		mvn ${@}
}

function mvn_gui(){
	# Usually you can run this local, if you want to see chrome gui run
	echo "RUN mvn_gui"
	local image_name="foolifish07/java-chromedriver"
	local volume_repositry="--volume=${HOME}/.m2:${home_in_docker}/.m2"
	local workspace_parameters="--volume=${WORKSPACE}:${project_in_docker}
							   --env=uid=${UID}" 

	docker run --rm \
		--privileged \
		-v /dev/shm:/dev/shm \
		${volume_repositry} \
		${workspace_parameters} \
		${image_name} \
		mvn ${@}
}

#=======
# test
#=======
function test1(){
	mvn -v
	mvn_gui -v
	npm -v
}

# test1
