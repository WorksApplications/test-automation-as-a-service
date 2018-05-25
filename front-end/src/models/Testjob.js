import Preset from './Preset.js'

export default function Testjob (testjob) {
  this.serial = ''
  this.create = ''
  this.start = ''
  this.finish = ''
  this.status = ''
  this.report = ''
  this.scheduleSerial = ''
  this.params = new Preset()
  this.log = []
  this.resolve = {}
  this.resolve.resolved = true

  if (testjob) {
    if (testjob.report) this.report = testjob.report
    if (testjob.status) this.status = testjob.status
    if (testjob.create) this.start = testjob.create
    if (testjob.start) this.start = testjob.start
    if (testjob.finish) this.start = testjob.finish
    if (testjob.serial) this.serial = testjob.serial
    if (testjob.scheduleSerial) this.scheduleSerial = testjob.scheduleSerial
    if (testjob.params) this.params = testjob.params
    if (testjob.log) this.log = testjob.log
    if (testjob.resolve) this.resolve = testjob.resolve
  }
}
