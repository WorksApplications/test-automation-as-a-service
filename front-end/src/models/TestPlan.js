export default function TestPlan (testPlan) {
  this.name = ''
  this.start = ''
  this.end = ''
  this.collaborators = []
  this.objective = ''
  this.description = ''
  this.branch = 'develop'
  this.platforms = []
  this.testcases = []
  this.environment = {
    url: '',
    username: '',
    password: '',
    inherit: false
  }
  this.channel = {
    name: '',
    id: '',
    inherit: false
  }
  this.verdict = {
    result: '',
    reason: ''
  }

  if (testPlan) {
    if (testPlan.name) this.name = testPlan.name
    if (testPlan.start) this.start = new Date(testPlan.start)
    if (testPlan.end) this.end = new Date(testPlan.end)
    if (testPlan.collaborators) this.collaborators = testPlan.collaborators
    if (testPlan.objective) this.objective = testPlan.objective
    if (testPlan.description) this.description = testPlan.description
    if (testPlan.branch) this.branch = testPlan.branch
    if (testPlan.platforms) this.platforms = testPlan.platforms
    if (testPlan.testcases) this.testcases = testPlan.testcases
    if (testPlan.environment) this.environment = testPlan.environment
    if (testPlan.channel) this.channel = testPlan.channel
    if (testPlan.verdict) this.verdict = testPlan.verdict
  }
}
