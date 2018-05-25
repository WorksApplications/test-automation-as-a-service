FROM selenium/node-firefox-debug:3.8.1-bohrium

ARG RESOURCES=http://shanghaiqe.internal.worksap.com

USER root
COPY entry_point.sh /opt/bin/entry_point.sh
RUN chmod 755 /opt/bin/entry_point.sh

# change firefox node desktop
COPY wallpaper_firefox.jpg /usr/share/images/fluxbox/ubuntu-light.png

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
 && wget $RESOURCES/apache-maven-$MAVEN_VERSION-bin.tar.gz -qO - \
    | tar -xzC $MAVEN_HOME --strip-components=1 \
 && ln -s $MAVEN_HOME/bin/mvn /usr/local/bin/mvn \
 && whereis mvn
# change mirrors && logger
COPY ./java/settings.xml $MAVEN_HOME/conf/settings.xml
COPY ./java/simplelogger.properties /opt/maven/conf/logging/simplelogger.properties

RUN usermod -a -G root seluser

USER seluser
