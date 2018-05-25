var sessions = {};

function diffTime(serial) {
  var curr = Date.now();
  var session = sessions[serial];
  if(session) return (curr - session.startTime) / 1000;
  else return 0;
}

function createSession(serial) {
  sessions[serial] = {
    startTime: Date.now()
  };
}

function getSession(serial) {
  return sessions[serial];
}

function pushElement(serial, id, val) {
  try {
    let elements = null;
    if (!sessions[serial]) {
      sessions[serial] = {
        startTime: Date.now()
      };
      elements = sessions[serial];
    } else {
      elements = sessions[serial];
    }

    elements[id] = val;
    return true;
  } catch (e) {
    return false;
  }
}

function getElement(serial, id) {
  try {
    return sessions[serial][id];
  } catch (e) {
    return undefined;
  }
}

function deleteSession(serial) {
  try {
    delete sessions[serial];
    return true;
  } catch(er) {
    return false;
  }
}

const AN_HOUR = 60 * 60 * 1000;
const INTERVAL = AN_HOUR;

// system will clear the sessions every some time
setInterval(() => {
  Object.keys(sessions).forEach((p) => {
    const timestamp = sessions[p].startTime;
    if (Date.now() - timestamp > INTERVAL) {
      delete sessions[p];
    }
  });
}, INTERVAL);

module.exports = {
  pushElement, getElement, deleteSession, createSession, getSession, diffTime
};
