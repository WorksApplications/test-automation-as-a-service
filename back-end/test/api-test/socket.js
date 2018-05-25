let io = require('socket.io-client');
let request = require('supertest');
let assert = require('assert');
let config = require('../../config');
let app = require('../../index');
let SocketContext = require('../../socket-context');
let EventType = require('../../socket-context').EventType;

describe('Socket Test', () => {
  let sockets = [];
  let users = ['li_d', 'tang_sa'];
  let groups = ['qe'];
  let clientsUser = [
    {
      username: users[0],
      groups: groups
    },
    {
      username: users[1],
      groups: groups
    }
  ];
  let updateEvent = 'update_event';
  let updateMsgSentToUser = 'update_msg_user';
  let updateMsgSentToGroups = 'update_msg_groups';

  let jobSerial;

  before(done => {
    let connectCount = 0;
    [0, 1].forEach(index => {
      let socket = io(`http://${config.server.host}:${config.server.port}`);
      socket.on('connect', () => {
        connectCount ++;
        if (connectCount === 2) {
          done();
        }
      });
      sockets[index] = socket;
    });
  });

  after(done => {
    sockets.forEach(socket => {
      if (socket.connected) {
        socket.disconnect();
      }
    });
    request(app).delete(`/testjobs/${jobSerial}`).end();
    done();
  });

  [0, 1].forEach(index => {
    it(`Set user${index} to socket${index}`, function (done) {
      sockets[index].emit('set_user', clientsUser[index]);
      sockets[index].on('set_user_ack', ack => {
        assert.equal(ack.success, true);
        let socketContext = new SocketContext();
        let socketIds = socketContext.getSocketsByUser(clientsUser[index].username).map(socket => socket.id);
        assert.equal(socketIds.includes(sockets[index].id), true);
        done();
      });
    });
  });

  it('Broadcast update to user0', done => {
    let socketContext = new SocketContext();
    socketContext.broadcastToUser(EventType.UPDATE, users[0], updateEvent, updateMsgSentToUser);
    sockets[0].on(updateEvent, msg => {
      assert.equal(msg, updateMsgSentToUser);
      sockets[0].emit('ack', EventType.UPDATE, updateEvent);
      sockets[0].off(updateEvent);
      done();
    });
  });

  it('Broadcast update to groups', done => {
    let socketContext = new SocketContext();
    socketContext.broadcastToGroups(EventType.UPDATE, groups, updateEvent, updateMsgSentToGroups);
    let receivedCount = 0;
    [0, 1].forEach(index => {
      sockets[index].on(updateEvent, msg => {
        assert.equal(msg, updateMsgSentToGroups);
        sockets[index].emit('ack', EventType.UPDATE, updateEvent);
        sockets[index].off(updateEvent);
        receivedCount ++;
        if (receivedCount === 2) {
          done();
        }
      });
    });
  });

  let body = {
    name: 'Mocha job',
    branch: 'develop',
    url: 'https://jillj-develop.hue.worksap.com/',
    username: 'hue-root',
    password: 'hue-r00t',
    platform: 'chrome',
    channel: 'kuang_qi_test',
    channelId: 'C3NNDSEE4',
    testcases: ['collaboration.timeline.TimelineLoginTest#reachTimeline'],
    params: [],
    groups: []
  };
  let userToken = {
    li_d: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpX2QiLCJpYXQiOjE1MjMxODQ1ODQsImV4cCI6MTYyMzkwNDU4NH0.XBcFsL2gO3nMEItfcA3q4h-6qyspwxVVQXtm2zK7c5E'
  };

  it('Trigger a normal test job', done => {
    request(app).post('/testjobs')
      .set('Cookie', [`token=${userToken.li_d}`])
      .send(body)
      .expect(201)
      .expect(function(res) {
        assert.equal(res.body.success, true);
        assert.equal(res.body.info, 'A test job is triggered.');
        jobSerial = res.body.serial;
      })
      .end(done);
  });

  it('Listen test job by WebSocket', function (done) {
    this.timeout(301000);
    sockets[0].on('update_test_job', args => {
      let updateKey = args[0];
      let serial = parseInt(args[1]);
      let updateValue = args[2];
      assert.equal(serial, jobSerial);
      switch (updateKey) {
        case 'progress':
          console.log(`progress: ${JSON.stringify(updateValue[0], null, 2)}`);
          break;
        case 'status':
          console.log(`status: ${updateValue[0]}`);
          if (updateValue[0] === 'Finished' ||
            updateValue[0] === 'Canceled' ||
            updateValue[0] === 'Error') {
            done();
          }
          break;
        case 'live_info':
          console.log(`live_info: ${updateValue[0]}, ${updateValue[1].toString()}, ${updateValue[2]}`);
          break;
        case 'log':
          console.log(`log: ${JSON.stringify(updateValue[0], null, 2)}`);
          break;
        case 'step':
          console.log(`step: ${JSON.stringify(updateValue[0], null, 2)}`);
          break;
        case 'step_result':
          console.log(`step_result: ${updateValue[0]}, ${updateValue[1]}`);
          break;
        case 'exec_stack':
          console.log(`exec_stack: ${JSON.stringify(updateValue[0], null, 2)}, ${JSON.stringify(updateValue[1], null, 2)}`);
          break;
        case 'exec_stack_exception':
          console.log(`exec_stack_exception: ${updateValue[0]}, ${JSON.stringify(updateValue[1], null, 2)}, ${JSON.stringify(updateValue[2], null, 2)}`);
          break;
        default:
          break;
      }
    });
  });

  [0, 1].forEach(index => {
    it(`Remove user${index} from socket${index}`, done => {
      sockets[index].emit('remove_user', clientsUser[index]);
      sockets[index].on('remove_user_ack', ack => {
        assert.equal(ack.success, true);
        let socketContext = new SocketContext();
        let socketIds = socketContext.getSocketsByUser(clientsUser[index].username).map(socket => socket.id);
        assert.equal(socketIds.includes(sockets[index].id), false);
        done();
      });
    });
  });

});