# docker

This is a dockerfile's code repository.

## 1. About the files within each folder

### build docker image 
you can build the docker images by run `build.sh`.

### How to use docker image 
about how to use the image, please refer to `run.sh`

### Other files
There are other files which related with `Dockerfile`,
such as
* `startup.sh` which defines the how to run before the container runs your commands
* Some files as `settings.xml`, a configure file.

## Relation between images 

```
graph LR
base-->java
base-->nodejs
base-->chrome
java-->java-chromedriver
```

## 2. Develop && Production

### Develop
In Develop environment, you can run 
```
$ ./develop.sh
```
this file read about the configuration
- docker-compose.yml
- docker-compose.override.yml

### Production
In Production environment, you can run 
```
$ ./build.sh && deploy.sh
```
these files only read about the configuration
- docker-compose.yml

build.sh && deploy.sh is related to the job on Jenkins.