export default function Preset (preset) {
  this.name = ''
  this.branch = 'develop'
  this.url = 'https://jillg-develop.hue.worksap.com/'
  this.appUrl = ''
  this.channel = 'taas-test-report'
  this.channelId = 'C5AT4TGR5'
  this.groups = []
  this.testcases = []
  this.username = 'hue-root'
  this.password = 'hue-r00t'
  this.platform = 'chrome'
  this.params = []

  if (preset) {
    if (preset.name) this.name = preset.name
    if (preset.branch) this.branch = preset.branch
    if (preset.url) this.url = preset.url
    if (preset.appUrl) this.appUrl = preset.appUrl
    if (preset.channel) this.channel = preset.channel
    if (preset.channelId) this.channelId = preset.channelId
    if (preset.groups) this.groups = preset.groups
    if (preset.testcases) this.testcases = preset.testcases
    if (preset.username) this.username = preset.username
    if (preset.password) this.password = preset.password
    if (preset.platform) this.platform = preset.platform
    if (preset.params) this.params = preset.params
  }
}
