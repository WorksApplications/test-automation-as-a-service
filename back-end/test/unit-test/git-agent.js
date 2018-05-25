var git = require('../../runner/git-agent');
var fs = require('fs-extra');
var assert = require('assert');
var proc = require('../../runner/process-pool');

describe('Test Git Agent', function() {
  this.timeout(30000);
  it('Test clone, retry and fail', async function() {
    var workspace = __dirname + '/test-workspace/';
    await fs.emptyDir(workspace);
    try {
      await git.fetchCode('git@scm.hue.workslan:tools/hue-auto-tests.git', 'branch-not-exist', workspace, 0, 2, (log, serial) => console.log(log));
    } catch (err) {
      //assert.equal(err)
      assert.equal(err.message, 'Retry limit reached');
    }
    await fs.remove(workspace);
  });

  it('Test clone and kill', async function() {
    var workspace = __dirname + '/test-workspace/';
    await fs.emptyDir(workspace);
    var gitProc = git.fetchCode('git@scm.hue.workslan:tools/hue-auto-tests.git', 'develop', workspace, 0, 3, (log, serial) => console.log(log));
    setTimeout(function() { proc.terminate(0, 1000); }, 500);
    try {
      await gitProc;
    } catch (err) {
      assert.equal(err.message, 'Git operation aborted by SIGTERM');
    }
    await fs.remove(workspace);
  });

  it('Test clone code and finish', async function() {
    var workspace = __dirname + '/test-workspace/';
    await fs.emptyDir(workspace);
    await git.fetchCode('git@scm.hue.workslan:tools/hue-auto-tests.git', 'develop', workspace, 0, 3, log => console.log(log));
    await fs.remove(workspace);
  });

  it('Test list branches and finish', async function() {
    var workspace = __dirname + '/test-workspace/';
    await fs.emptyDir(workspace);
    await git.fetchCode('git@scm.hue.workslan:tools/hue-auto-tests.git', 'develop', workspace, 0, 3, log => console.log(log));
    var ret = await git.listBranches(workspace, 0, log => console.log(log));
    assert.ok(ret.branches.indexOf('develop') !== -1 && ret.branches.indexOf('master') !== -1);
    await fs.remove(workspace);
  });

  it('Test list branches and cancel', async function() {
    var workspace = __dirname + '/test-workspace/';
    await fs.emptyDir(workspace);
    await git.fetchCode('git@scm.hue.workslan:tools/hue-auto-tests.git', 'develop', workspace, 0, log => console.log(log));
    var listProc = git.listBranches(workspace, 0, log => console.log(log));
    setTimeout(function() { proc.terminate(0, 1000); }, 500);
    try {
      await listProc;
    } catch (err) {
      assert.equal(err.message, 'Git operation aborted by SIGTERM');
    }
    await fs.remove(workspace);
  });

  it('Test list branches and fail', async function() {
    var listProc = git.listBranches('/', 0, log => console.log(log));
    try {
      await listProc;
    } catch (err) {
      assert.equal(err.message, 'Git exited with code 128.');
    }
  });
});
