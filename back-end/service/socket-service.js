const SocketContext = require('../socket-context');
const EventType = require('../socket-context').EventType;
var TestJobModel = require('../models/testjobs').Model;

const service = {
  /**
   * Broadcast test job update to users related to the test job
   * 
   * @param {String} updateKey The updated key of test job
   * @param {Number} serial The serial of test job
   * @param {Object} options options
   *    {Boolean} forceToAllUsers: Whether force to broadcast test job update to all users
   * @param {Array} args The arguments sent to users
   * 
   */
  async broadcastToTestJobUserOrGroups (updateKey, serial, options, ...args) {
    let socketContext = new SocketContext();
    if (options.forceToAllUsers) {
      socketContext.broadcast(EventType.UPDATE, 'update_test_job', updateKey, serial, args);
    } else {
      let ret = await TestJobModel.findOne({serial: serial}, {operator: true, groups: true});
      if (ret.groups) {
        socketContext.broadcastToGroups(EventType.UPDATE, ret.groups, 'update_test_job', updateKey, serial, args);
      } else if (ret.operator) {
        socketContext.broadcastToUser(EventType.UPDATE, ret.operator, 'update_test_job', updateKey, serial, args);
      } else {
        socketContext.broadcast(EventType.UPDATE, 'update_test_job', updateKey, serial, args);
      }
    }
  },
  broadcastScheduleTrigger (serial) {
    let socketContext = new SocketContext();
    socketContext.broadcast(EventType.UPDATE, 'update_schedule_trigger', serial);
  }
};

module.exports = service;