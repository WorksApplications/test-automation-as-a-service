FROM python:2.7.13

#==================
# install vnc2flv
#+=================
RUN pip install vnc2flv &&\
    which flvrec.py

#=================
# Node env
#=================
ARG NODE_VERSION=8.10.0
ARG NODE_HOME=/opt/node

ENV PATH=$NODE_HOME/bin:$PATH
# !!Specify node resource by yourself
RUN mkdir -p ${NODE_HOME} \
 && curl -SL 'resource of node' \
    | tar -xJC ${NODE_HOME} --strip-components=1 \
 && node -v

#====================
# Back-end project
#+===================
ARG api_server=/code
COPY ./ ${api_server}
COPY ./config.docker.yml ${api_server}/config.yml
RUN mkdir -p /videos/
RUN mkdir -p /var/log/media-server/
WORKDIR $api_server

#=================
# Startup
#=================
CMD ["npm", "run", "forever"]
