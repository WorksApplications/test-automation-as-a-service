#!/bin/bash
#
# IMPORTANT: Change this file only in directory StandaloneDebug!

source /opt/bin/functions.sh

SCREEN_WIDTH=1920
SCREEN_HEIGHT=1080
export GEOMETRY="$SCREEN_WIDTH""x""$SCREEN_HEIGHT""x""$SCREEN_DEPTH"

function shutdown {
  kill -s SIGTERM $NODE_PID
  wait $NODE_PID
}

if [ ! -z "$SE_OPTS" ]; then
  echo "appending selenium options: ${SE_OPTS}"
fi

rm -f /tmp/.X*lock

SERVERNUM=$(get_server_num)

DISPLAY=$DISPLAY \
  xvfb-run -n $SERVERNUM --server-args="-screen 0 $GEOMETRY -ac +extension RANDR" \
  nohup java ${JAVA_OPTS} -jar /opt/selenium/selenium-server-standalone.jar & \
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

fluxbox -display $DISPLAY -log /dev/null &

x11vnc -forever -quiet -shared -rfbport 5900 -display $DISPLAY -nopw -viewonly &

# wait $NODE_PID
