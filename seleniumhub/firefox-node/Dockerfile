FROM selenium/node-firefox-debug:3.8.1-aluminum

USER root
COPY entry_point.sh /opt/bin/entry_point.sh
RUN chmod 755 /opt/bin/entry_point.sh

# change firefox node desktop
COPY wallpaper_firefox.jpg /usr/share/images/fluxbox/ubuntu-light.png

RUN usermod -a -G root seluser

USER seluser