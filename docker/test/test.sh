#!/bin/bash

mvn clean test \
    -f ~/Projects/hue-auto-tests/e2e-tests/pom.xml \
    -P e2e \
    -e -B -fae \
    -Dmaven.test.failure.ignore=true \
    -Duse.remote.driver -Dremote.driver.url=localhost:4444/wd/hub \
    -Dbrowser=chrome \
    -Denv.url=http://jillh-develop.hue.worksap.com/ \
    -Dtest.user=hue-root \
    -Dtest.password=hue-r00t \
    -Dgroups="HueCommon"