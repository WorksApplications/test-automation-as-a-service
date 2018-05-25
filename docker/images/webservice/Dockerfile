FROM python:2.7.13

ARG RESOURCES=http://shanghaiqe.internal.worksap.com


#==================
# install vnc2flv
#+=================
RUN pip install vnc2flv &&\
    which flvrec.py
	

#==================
# Java env
#==================
ENV JAVA_HOME /opt/java
ARG ORACLE_JAVA_URL=$RESOURCES/jdk1.8.0_112.tar.gz

ENV PATH ${JAVA_HOME}/bin:$PATH
RUN mkdir -p $JAVA_HOME \
 	&& wget --header "Cookie: oraclelicense=accept-securebackup-cookie" $ORACLE_JAVA_URL -qO - \
		| tar -xzC $JAVA_HOME --strip-components=1 \
 	&& java -version

# Maven
ARG MAVEN_VERSION=3.5.0
ARG MAVEN_HOME=/opt/maven

RUN mkdir -p $MAVEN_HOME $MAVEN_REGISTRY \
 && curl -fsSL $RESOURCES/apache-maven-$MAVEN_VERSION-bin.tar.gz \
    | tar -xzC $MAVEN_HOME --strip-components=1 \
 && ln -s $MAVEN_HOME/bin/mvn /usr/local/bin/mvn \
 && whereis mvn
# change mirrors && logger
COPY ./java/settings.xml $MAVEN_HOME/conf/settings.xml
COPY ./java/simplelogger.properties /opt/maven/conf/logging/simplelogger.properties



#=================
# Node env
#=================
ARG NODE_VERSION=8.1.3
ARG NODE_HOME=/opt/node

ENV PATH=$NODE_HOME/bin:$PATH
RUN mkdir -p ${NODE_HOME} \
 && curl -SL $RESOURCES/node-v$NODE_VERSION-linux-x64.tar.xz \
    | tar -xJC ${NODE_HOME} --strip-components=1 \
 && node -v



#================================
# Add private key
#================================
COPY ./ssh /root/.ssh
RUN chmod 600 /root/.ssh/id_rsa



#====================
# Back-end project
#+===================
ARG api_server=/code
COPY ./back-end ${api_server}
WORKDIR $api_server



#=================
# Startup
#=================
CMD ["npm", "run", "forever"]