var logger = require('./logger');
var _ = require('lodash');

const EventType = {
  UPDATE: 'update',
  NOTIFY: 'notify'
};

function SocketContext() {
  return SocketContext.instance = SocketContext.instance ? SocketContext.instance : this;
}

SocketContext.prototype.getSockets = () => {
  return this.sockets;
};

SocketContext.prototype.getSocketsByUser = (username) => {
  return _.filter(this.sockets, socket => {
    return socket.user && socket.user.username === username;
  });
};

SocketContext.prototype.init = (io) => {
  this.io = io;
  this.sockets = [];
  this.lastUpdateMessages = {};
  const _this = this;
  this.io.sockets.on('connection', socket => {
    logger.debug(`New connection: ${socket.id}`);
    _this.sockets.push(socket);

    socket.on('set_user', user => {
      socket.user = user;
      if (user.groups) {
        socket.join(user.groups);
      } else {
        socket.join(user.username);
      }
      logger.debug(`User of ${socket.id}: ${user.username}`);
      socket.emit('set_user_ack', {
        success: true
      });
    });

    socket.on('remove_user', user => {
      _this.sockets.forEach(s => {
        if (s.user && s.user.username === user.username) {
          delete s.user;
        }
      });
      socket.emit('remove_user_ack', {
        success: true
      });
    });

    socket.on('ack', (type, event) => {
      if (type === EventType.UPDATE) {
        delete _this.lastUpdateMessages[socket.id][event];
        if (Object.keys(_this.lastUpdateMessages[socket.id]).length === 0) {
          delete _this.lastUpdateMessages[socket.id];
        }
      }
    });

    socket.on('disconnect', reason => {
      logger.debug(`Disconnect: ${socket.id}. Reason: ${reason}`);
      _.remove(_this.sockets, s => {
        return s.id === socket.id;
      });
    });

    socket.on('reconnection', oldId => {
      logger.debug(`Reconnection: ${socket.id} from ${oldId}`);
      let messages = _this.lastUpdateMessages[oldId];
      if (messages) {
        for (let event in messages) {
          cacheMessage(socket.id, event, messages[event]);
          socket.emit(event, messages[event]);
        }
        delete _this.lastUpdateMessages[oldId];
      }
    });
  });
};

SocketContext.prototype.broadcast = (type, event, ...args) => {
  this.io.sockets.emit(event, args);
};

SocketContext.prototype.broadcastToGroups = (type, groups, event, ...args) => {
  const _this = this;
  groups.forEach(group => {
    if (type === EventType.UPDATE) {
      _this.io.sockets.in(group).clients((error, clients) => {
        if (error) throw error;
        clients.forEach(client => cacheMessage(client, event, args));
      });
    }
    _this.io.to(group).emit(event, args);
  });
};

SocketContext.prototype.broadcastToUser = function (type, username, event, ...args) {
  this.getSocketsByUser(username).forEach(socket => {
    cacheMessage(socket.id, event, args);
    socket.emit(event, args);
  });
};

const cacheMessage = (id, event, args) => {
  this.lastUpdateMessages[id] || (this.lastUpdateMessages[id] = {});
  this.lastUpdateMessages[id][event] = args;
};

module.exports = SocketContext;
module.exports.EventType = EventType;