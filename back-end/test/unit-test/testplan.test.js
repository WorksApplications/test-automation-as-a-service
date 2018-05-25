const R = require('lodash');
const sinon = require('sinon');
const expect = require('chai').expect;
const assert = require('assert');
const TestPlanService = require('../../service/testplan-service');
const TestPlanModel = require('../../models/testplan').Model;

describe('TestPlan Service', function() {
  let obsoletedTestPlan = {
    'name': 'asdfsdfasdffffffffffffffsadfsdfsdfasdfasdf',
    'start': new Date('2018-01-03T16:00:00.000Z'),
    'end': new Date('2018-02-08T16:00:00.000Z'),
    'creator': 'yo_wu',
    'objective': 'astetaestsetasetaseasdfasdf\n\\asdf\\asd\\f\\as\nasd\nfasdf',
    'description': 'asteawetasetasetatea',
    'serial': 2,
    'state': 'finished',
    'lastUpdatedBy': 'yo_wu',
    'lastUpdatedAt': new Date('2018-01-01T09:39:06.039Z'),
    'verdict': {
      'result': '',
      'reason': ''
    },
    '__v': 0
  };

  let newTestPlan = R.clone(obsoletedTestPlan);
  newTestPlan.name = 'updated name';
  newTestPlan.lastUpdatedAt = new Date();

  it('test test plan model validation against required fields', (done) => {
    let model = new TestPlanModel();
    model.validate(err => {
      expect(err.errors.serial).to.exist;
      expect(err.errors.name).to.exist;
      expect(err.errors.state).to.exist;
      expect(err.errors.start).to.exist;
      expect(err.errors.end).to.exist;
      expect(err.errors.creator).to.exist;
      expect(err.errors.objective).to.exist;
      done();
    });
  });

  it('test isTestPlanObsoleted', async () => {
    let stub = sinon.stub(TestPlanModel, 'findTestPlanBySerial').resolves(obsoletedTestPlan);
    let testPlanSoletedResult = await TestPlanService.isTestPlanObsoleted(newTestPlan);
    assert(testPlanSoletedResult.obsoleted, 'Test Plan should be obsoleted');
    stub.restore();
  });

  it('test diff works', async () => {
    let diff = TestPlanService.getDiff(obsoletedTestPlan, newTestPlan);
    assert(diff.some(diff => diff.key === 'name'), 'diff should catch name changes');
    assert(diff.some(diff => diff.key === 'lastUpdatedAt'), 'diff should catch lastUpdatedAt changes');
  });
});