#!/bin/bash
#
# IMPORTANT: Change this file only in directory NodeDebug!

source /opt/bin/functions.sh
/opt/bin/generate_config > /opt/selenium/config.json

SCREEN_WIDTH=1920
SCREEN_HEIGHT=1080
export GEOMETRY="$SCREEN_WIDTH""x""$SCREEN_HEIGHT""x""$SCREEN_DEPTH"

if [ ! -e /opt/selenium/config.json ]; then
  echo No Selenium Node configuration file, the node-base image is not intended to be run directly. 1>&2
  exit 1
fi

if [ -z "$HUB_PORT_4444_TCP_ADDR" ]; then
  echo Not linked with a running Hub container 1>&2
  exit 1
fi

function shutdown {
  kill -s SIGTERM $NODE_PID
  wait $NODE_PID
}

if [ ! -z "$REMOTE_HOST" ]; then
  >&2 echo "REMOTE_HOST variable is *DEPRECATED* in these docker containers.  Please use SE_OPTS=\"-host <host> -port <port>\" instead!"
  exit 1
fi

if [ ! -z "$SE_OPTS" ]; then
  echo "appending selenium options: ${SE_OPTS}"
fi

SERVERNUM=$(get_server_num)

rm -f /tmp/.X*lock

DISPLAY=$DISPLAY \
  xvfb-run -n $SERVERNUM --server-args="-screen 0 $GEOMETRY -ac +extension RANDR" \
  java ${JAVA_OPTS} -jar /opt/selenium/selenium-server-standalone.jar \
    -role node \
    -hub http://$HUB_PORT_4444_TCP_ADDR:$HUB_PORT_4444_TCP_PORT/grid/register \
    -nodeConfig /opt/selenium/config.json \
    ${SE_OPTS} &
NODE_PID=$!

trap shutdown SIGTERM SIGINT
for i in $(seq 1 10)
do
  xdpyinfo -display $DISPLAY >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    break
  fi
  echo Waiting xvfb...
  sleep 0.5
done

fluxbox -display $DISPLAY &


#======================================================================================
# Refer: http://www.karlrunge.com/x11vnc/x11vnc_opts.html
#
# -usepw                 If no other password method was supplied on the command
#                        line, first look for ~/.vnc/passwd and if found use it
#                        with -rfbauth; next, look for ~/.vnc/passwdfile and
#                        use it with -passwdfile; otherwise, prompt the user
#                        for a password to create ~/.vnc/passwd and use it with
#                        the -rfbauth option.  If none of these succeed x11vnc
#                        exits immediately.
#
# -nopw                  Disable the big warning message when you use x11vnc
#                        without some sort of password.
#
# -display disp          X11 server display to connect to, usually :0.
#
# -viewonly              All VNC clients can only watch (default off).
#
# -shared                VNC display is shared, i.e. more than one viewer can
#                        connect at the same time (default off).
#
# -rfbport str           The VNC port to listen on (a LibVNCServer option), e.g.
#                        5900, 5901, etc.  If specified as "-rfbport PROMPT"
#                        then the x11vnc -gui is used to prompt the user to
#                        enter the port number.
#
# -forever               Keep listening for more connections rather than exiting
#                        as soon as the first client(s) disconnect. Same as -many
# 
#======================================================================================
# x11vnc -forever -shared -display $DISPLAY -rfbport 5900 -usepw &
x11vnc -forever -shared -display $DISPLAY -rfbport 25900 -nopw -viewonly &

wait $NODE_PID
