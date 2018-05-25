let request = require('supertest');
let assert = require('assert');
let app = require('../../index');

describe('Test Plan API tests', function () {
  let testPlanSerial;
  let taskSerial;
  let startDate = new Date();
  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 10);
  let testPlan = {
    'name': 'API test case',
    'objective': 'Objective',
    'description': '### desc\n\nthis is something to preview ',
    'branch': 'test-resolve-feature',
    'platforms' : [ 
      [ 
        {
          'label' : 'Desktop',
          'value' : 'desktop'
        }, 
        {
          'label' : 'Chrome',
          'value' : 'chrome'
        }
      ], 
      [ 
        {
          'label' : 'Desktop',
          'value' : 'desktop'
        }, 
        {
          'label' : 'Firefox',
          'value' : 'firefox'
        }
      ], 
      [ 
        {
          'label' : 'Mobile',
          'value' : 'mobile'
        }
      ], 
      [ 
        {
          'label' : 'API',
          'value' : 'api'
        }
      ]
    ],
    'testcases' : [ 
      [ 
        {
          'label' : 'Quality Assurance',
          'value' : 'qa'
        }
      ], 
      [ 
        {
          'label' : 'Enterprise Collaboration',
          'value' : 'collaboration'
        }, 
        {
          'label' : 'ToDo',
          'value' : 'todo'
        }
      ], 
      [ 
        {
          'label' : 'Enterprise Collaboration',
          'value' : 'collaboration'
        }, 
        {
          'label' : 'Timeline',
          'value' : 'timeline'
        }
      ], 
      [ 
        {
          'label' : 'Enterprise Collaboration',
          'value' : 'collaboration'
        }, 
        {
          'label' : 'Timeline Mobile',
          'value' : 'timelinemobile'
        }
      ]
    ]
  };
  testPlan.start = startDate;
  testPlan.end = endDate;
  let task = {
    'name': 'Task of Test Plan',
    'assignee': 'tang_sa',
    'type': 'Auto',
    'description': 'Description',
    'branch': 'test-resolve-feature',
    'platform': 'chrome',
    'testcases': [
      [
        {
          'label': 'Quality Assurance',
          'value': 'qa'
        },
        {
          'label': 'QE',
          'value': 'qe'
        },
        {
          'label': 'Resolve Test',
          'value': 'Resolve Test'
        }
      ]
    ],
    'environment' : {
      'inherit' : false,
      'password' : 'hue-r00t',
      'username' : 'hue-root',
      'url' : 'https://jillj-develop.hue.worksap.com/'
    },
    'channel' : {
      'inherit' : true,
      'id' : 'C5AT4TGR5',
      'name' : 'taas-test-report'
    }
  };
  task.start = startDate;
  task.end = endDate;
  let oldTaskDescription = task.description;
  let userToken = {
    li_d: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpX2QiLCJpYXQiOjE1MjMxODQ1ODQsImV4cCI6MTYyMzkwNDU4NH0.XBcFsL2gO3nMEItfcA3q4h-6qyspwxVVQXtm2zK7c5E',
    tang_sa: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhbmdfc2EiLCJpYXQiOjE1MjMxODQ1ODQsImV4cCI6MTYyMzkwNDU4NH0.PnI1d64Zskqt3p1E0JkUXP3RG8Rne8a5zQ95LIHuDt0',
    li_t: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpX3QiLCJpYXQiOjE1MjMxODQ1ODQsImV4cCI6MTYyMzkwNDU4NH0.l8pa62FipmCXOQAxcV331eACCdy_BuHvZHXDdc5t4tk',
    huang_z: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1YW5nX3oiLCJpYXQiOjE1MjMyNDMzMjcsImV4cCI6MjE0NzQ4MzY0N30.xmDctm2yyEMY191QAkIJxFT_OsiG7fBpqD7NF-l7wIE'
  };

  it('POST /testplans to create (li_d)', function (done) {
    request(app).post('/testplans')
      .set('Cookie', [`token=${userToken.li_d}`])
      .send(testPlan)
      .expect(200)
      .expect(res => {
        assert(res.body.success, true);
        let theNewTestPlan = res.body.test_plan;
        assert.equal(theNewTestPlan.state, 'new');
        assert.equal(theNewTestPlan.creator, 'li_d');
        testPlanSerial = theNewTestPlan.serial;
        testPlan = theNewTestPlan;
      }).end(done);
  });

  it('PUT /testplans to update (tang_sa)', function (done) {
    if (testPlanSerial) {
      let oldDescription = testPlan.description;
      testPlan.description = 'Updated description' + new Date();
      request(app).put(`/testplans/${testPlanSerial}?confirmApply=true`)
        .set('Cookie', [`token=${userToken.tang_sa}`])
        .send(testPlan)
        .expect(200)
        .expect(res => {
          let updatedTestPlan = res.body.test_plan;
          assert(res.body.success, true);
          assert.equal(updatedTestPlan.description, testPlan.description);
          assert.deepStrictEqual(updatedTestPlan.collaborators, ['tang_sa']);
          let activities = updatedTestPlan.activities;
          let latestActivity = activities[activities.length - 1];
          delete latestActivity._id;
          delete latestActivity.date;
          let expectActivity = {
            operation: 'Update Test Plan',
            type: 'Edit',
            user: 'tang_sa',
            edits: [
              {
                key: 'description',
                newValue: updatedTestPlan.description,
                oldValue: oldDescription
              }
            ]
          };
          assert.deepStrictEqual(latestActivity, expectActivity);
        }).end(done);
    }
  });

  it('POST /testplans/:testPlanSerial/tasks to create task (li_t)', function (done) {
    if (testPlanSerial) {
      task.testPlanId = testPlanSerial;
      request(app).post(`/testplans/${testPlanSerial}/tasks`)
        .set('Cookie', [`token=${userToken.li_t}`])
        .send(task)
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          let theNewTask = res.body.task;
          assert.equal(theNewTask.state, 'new');
          taskSerial = theNewTask.serial;
          task = theNewTask;
        }).end(done);
    }
  });

  it('li_t should be added to collaborators and activity should be recorded after task created', function (done) {
    if (testPlanSerial) {
      request(app).get(`/testplans/${testPlanSerial}`)
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          assert.deepStrictEqual(res.body.test_plan.collaborators, ['tang_sa', 'li_t']);
          let activities = res.body.test_plan.activities;
          let latestActivity = activities[activities.length - 1];
          delete latestActivity._id;
          delete latestActivity.date;
          let expectActivity = {
            operation: `Create Task#${taskSerial}: ${task.name}`,
            type: 'Operate',
            user: 'li_t',
            edits: []
          };
          assert.deepStrictEqual(latestActivity, expectActivity);
        }).end(done);
    }
  });

  it('PUT /testplans/:testPlanSerial/tasks/:taskSerial to update task (tang_sa)', function (done) {
    if (testPlanSerial && taskSerial) {
      task.description += ' Updated at ' + new Date();
      request(app).put(`/testplans/${testPlanSerial}/tasks/${taskSerial}`)
        .set('Cookie', [`token=${userToken.tang_sa}`])
        .send(task)
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          assert.equal(res.body.task.description, task.description);
        }).end(done);
    }
  });

  it('tang_sa should not be added to collaborators repeatedly but activity should be recorded after task updated', function (done) {
    if (testPlanSerial) {
      request(app).get(`/testplans/${testPlanSerial}`)
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          assert.deepStrictEqual(res.body.test_plan.collaborators, ['tang_sa', 'li_t']);
          let activities = res.body.test_plan.activities;
          let latestActivity = activities[activities.length - 1];
          delete latestActivity._id;
          delete latestActivity.date;
          let expectActivity = {
            operation: `Update Task#${taskSerial}: ${task.name}`,
            type: 'Edit',
            user: 'tang_sa',
            edits: [
              {
                key: 'description',
                newValue: task.description,
                oldValue: oldTaskDescription
              }
            ]
          };
          assert.deepStrictEqual(latestActivity, expectActivity);
        }).end(done);
    }
  });

  let testJobSerial;

  it('Trigger a test job from task (li_d)', function (done) {
    if (testPlanSerial && taskSerial) {
      let testJobFromTask = {
        'testPlanSerial': testPlanSerial,
        'taskSerial': taskSerial,
        'name': `${task.name} (Task #${taskSerial} of Test Plan #${testPlanSerial})`,
        'branch': task.branch,
        'url': task.environment.url,
        'appUrl': null,
        'channel': task.channel.name,
        'channelId': task.channel.id,
        'testcases': [
          'qa.qe.ResolveFeatureTest#FailedTest',
          'qa.qe.ResolveFeatureTest#PassedTest'
        ],
        'username': task.environment.username,
        'password': task.environment.password,
        'platform': task.platform,
        'params':[]
      };
      request(app).post('/testjobs')
        .set('Cookie', [`token=${userToken.li_d}`])
        .send(testJobFromTask)
        .expect(201)
        .expect(res => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.info, 'A test job is triggered.');
          testJobSerial = res.body.serial;
        })
        .end(done);
    }
  });

  it('Wait for the test job to start', function (done) {
    process.stdout.write('        Wait for start');
    this.timeout(31000);
    let count = 30;
    let handle = setInterval(() => {
      process.stdout.write('.');
      count--;
      if(count === 0) clearInterval(handle);
      request(app).get(`/testjobs/${testJobSerial}`)
        .expect(200)
        .expect(res => {
          if(res.body.testjobs.status === 'Error') {
            clearInterval(handle);
            done(new Error('The test job end with an ERROR status'));
          }
          if(res.body.testjobs.status === 'Running' || res.body.testjobs.status === 'Finished') {
            // Success
            process.stdout.write('\n');
            clearInterval(handle);
            done();
          }
        })
        .end(() => {});
    }, 1000);
  });

  it('Wait for the test job to finish', function (done) {
    process.stdout.write('        Wait for finish');
    this.timeout(301000);
    let count = 300;
    let handle = setInterval(() => {
      process.stdout.write('.');
      count--;
      if(count === 0) clearInterval(handle);
      request(app).get(`/testjobs/${testJobSerial}`)
        .expect(200)
        .expect(res => {
          if(res.body.testjobs.status === 'Error') {
            clearInterval(handle);
            done(new Error('The test job end with an ERROR status'));
          }
          if(res.body.testjobs.status === 'Finished') {
            // Success
            process.stdout.write('\n');
            clearInterval(handle);
            done();
          }
        })
        .end(() => {});
    }, 1000);
  });

  let resolveInfo = {
    resolved: true,
    reason: 'Test resolve reason',
    comment: 'Test resolve comment'
  };

  it('Resolve the failed test job (li_d)', function (done) {
    request(app).put(`/testjobs/${testJobSerial}/resolve`)
      .set('Cookie', [`token=${userToken.li_d}`])
      .send(resolveInfo)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        assert.equal(res.body.info, 'Resolve updated.');
      })
      .end(done);
  });

  it('Verify the task state after resolving', function (done) {
    request(app).get(`/testplans/${testPlanSerial}/tasks/${taskSerial}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let taskResovled = res.body.task;
        assert.equal(taskResovled.state, 'finished');
        assert.equal(taskResovled.verdict.result, resolveInfo.reason);
        assert.equal(taskResovled.verdict.reason, resolveInfo.comment);
      }).end(done);
  });

  it('Verify the test result after resolving', function (done) {
    request(app).get(`/testresults?jobId=${testJobSerial}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let testresults = res.body.testresults;
        testresults.forEach(testresult => {
          if (testresult.status !== 'PASSED') {
            assert.equal(testresult.resolved, true);
          }
        });
      })
      .end(done);
  });

  it('Verify the dashboard after resolving', function (done) {
    request(app).get(`/dashboard/${task.branch}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let dashboard = res.body.dashboard;
        let testcases = dashboard.testresults.qa.qe['Resolve Test'].testcases;
        testcases.forEach(testcase => {
          let result = testcase.testResults;
          if (testcase.name === 'Failed') {
            assert.equal(result.chrome, 'RESOLVED');
            assert.equal(result[testPlanSerial].chrome, 'RESOLVED');
            assert.equal(result[testPlanSerial][taskSerial].chrome, 'RESOLVED');
          } else {
            assert.equal(result.chrome, 'PASSED');
            assert.equal(result[testPlanSerial].chrome, 'PASSED');
            assert.equal(result[testPlanSerial][taskSerial].chrome, 'PASSED');
          }
        });
      })
      .end(done);
  });

  it('Unresolve the failed test job (li_d)', function (done) {
    request(app).put(`/testjobs/${testJobSerial}/resolve`)
      .set('Cookie', [`token=${userToken.li_d}`])
      .send({
        resolved: false,
        reason: '',
        comment: ''
      })
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        assert.equal(res.body.info, 'Resolve updated.');
      })
      .end(done);
  });

  it('Verify the task state after unresolving', function (done) {
    request(app).get(`/testplans/${testPlanSerial}/tasks/${taskSerial}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let taskResovled = res.body.task;
        assert.equal(taskResovled.state, 'in progress');
        assert.equal(taskResovled.verdict.result, '');
        assert.equal(taskResovled.verdict.reason, '');
      }).end(done);
  });

  it('Verify the test result after unresolving', function (done) {
    request(app).get(`/testresults?jobId=${testJobSerial}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let testresults = res.body.testresults;
        testresults.forEach(testresult => {
          if (testresult.status !== 'PASSED') {
            assert.equal(testresult.resolved, false);
          }
        });
      })
      .end(done);
  });

  it('Verify the dashboard after unresolving', function (done) {
    request(app).get(`/dashboard/${task.branch}`)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.success, true);
        let dashboard = res.body.dashboard;
        let testcases = dashboard.testresults.qa.qe['Resolve Test'].testcases;
        testcases.forEach(testcase => {
          let result = testcase.testResults;
          if (testcase.name === 'Failed') {
            assert.equal(result.chrome, 'FAILED');
            assert.equal(result[testPlanSerial].chrome, 'FAILED');
            assert.equal(result[testPlanSerial][taskSerial].chrome, 'FAILED');
          } else {
            assert.equal(result.chrome, 'PASSED');
            assert.equal(result[testPlanSerial].chrome, 'PASSED');
            assert.equal(result[testPlanSerial][taskSerial].chrome, 'PASSED');
          }
        });
      })
      .end(done);
  });

  let commentId;

  it('POST /testplans/:testPlanSerial/comments to comment the test plan (huang_z)', function (done) {
    if (testPlanSerial) {
      let commentContent = 'This is a comment.';
      request(app).post(`/testplans/${testPlanSerial}/comments`)
        .set('Cookie', [`token=${userToken.huang_z}`])
        .send({
          content: commentContent
        })
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          assert.deepStrictEqual(res.body.test_plan.collaborators, ['tang_sa', 'li_t', 'huang_z']);
          let comments = res.body.test_plan.comments;
          let latestComment = comments[comments.length - 1];
          assert.equal(latestComment.creator, 'huang_z');
          assert.equal(latestComment.content, commentContent);
          commentId = latestComment._id;
        }).end(done);
    }
  });

  it('PUT /testplans/:testPlanSerial/comments/:id to update comment (huang_z)', function (done) {
    if (testPlanSerial && commentId) {
      let commentContentUpdated = 'This is a comment (updated).';
      request(app).put(`/testplans/${testPlanSerial}/comments/${commentId}`)
        .set('Cookie', [`token=${userToken.huang_z}`])
        .send({
          content: commentContentUpdated
        })
        .expect(200)
        .expect(res => {
          assert(res.body.success, true);
          assert.deepStrictEqual(res.body.test_plan.collaborators, ['tang_sa', 'li_t', 'huang_z']);
          let comments = res.body.test_plan.comments;
          let latestComment = comments[comments.length - 1];
          assert.equal(latestComment.content, commentContentUpdated);
        }).end(done);
    }
  });
});
