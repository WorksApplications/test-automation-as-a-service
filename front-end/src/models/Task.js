export default function Task (task) {
  this.name = ''
  this.start = ''
  this.end = ''
  this.type = 'Auto'
  this.assignee = ''
  this.description = ''
  this.branch = 'develop'
  this.platform = ''
  this.testcases = []
  this.appUrl = ''
  this.environment = {
    url: 'https://jillj-develop.hue.worksap.com/',
    username: 'hue-root',
    password: 'hue-r00t',
    inherit: false
  }
  this.channel = {
    name: 'taas-test-report',
    id: 'C5AT4TGR5',
    inherit: false
  }
  this.params = []
  this.verdict = {
    result: '',
    reason: ''
  }

  if (task) {
    if (task.name) this.name = task.name
    if (task.start) this.start = new Date(task.start)
    if (task.end) this.end = new Date(task.end)
    if (task.assignee) this.assignee = task.assignee
    if (task.type) this.type = task.type
    if (task.description) this.description = task.description
    if (task.branch) this.branch = task.branch
    if (task.platforms) this.platforms = task.platforms
    if (task.testcases) this.testcases = task.testcases
    if (task.appUrl) this.appUrl = task.appUrl
    if (task.environment) this.environment = task.environment
    if (task.channel) this.channel = task.channel
    if (task.params) this.params = task.params
    if (task.verdict) this.verdict = task.verdict
  }
}
