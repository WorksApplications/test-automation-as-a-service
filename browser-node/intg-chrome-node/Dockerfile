FROM selenium/standalone-chrome-debug:3.8.1-aluminum

USER root
COPY entry_point.sh /opt/bin/entry_point.sh
RUN chmod 755 /opt/bin/entry_point.sh

# change chrome node desktop
COPY wallpaper_chrome.jpg /usr/share/images/fluxbox/ubuntu-light.png

#==================
# Java env
#==================
ENV JAVA_HOME /opt/java
# !!Specify jdk resource by yourself
ARG ORACLE_JAVA_URL='resource of jdk'

ENV PATH ${JAVA_HOME}/bin:$PATH
RUN mkdir -p $JAVA_HOME \
 	&& wget --header "Cookie: oraclelicense=accept-securebackup-cookie" $ORACLE_JAVA_URL -qO - \
		| tar -xzC $JAVA_HOME --strip-components=1 \
 	&& java -version

# Maven
ARG MAVEN_VERSION=3.5.0
ARG MAVEN_HOME=/opt/maven

# !!Specify maven resource by yourself
RUN mkdir -p $MAVEN_HOME $MAVEN_REGISTRY \
 && wget 'resource of maven' -qO - \
    | tar -xzC $MAVEN_HOME --strip-components=1 \
 && ln -s $MAVEN_HOME/bin/mvn /usr/local/bin/mvn \
 && whereis mvn
# change mirrors && logger
COPY ./java/settings.xml $MAVEN_HOME/conf/settings.xml
COPY ./java/simplelogger.properties /opt/maven/conf/logging/simplelogger.properties

RUN usermod -a -G root seluser

USER seluser
