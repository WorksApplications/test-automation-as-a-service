import Preset from './Preset.js'
import store from '@/store'

export default function Schedule (schedule) {
  this.serial = 0
  this.count = 0
  this.name = ''
  this.cron = '0 0 9 * * * ?'
  this.timezone = store.state.sysinfo.timezone
  this.enabled = true
  this.lastRun = ''
  this.nextRun = ''
  this.params = new Preset()

  if (schedule) {
    if (schedule.serial) this.serial = schedule.serial
    if (schedule.count) this.count = schedule.count
    if (schedule.name) this.name = schedule.name
    if (schedule.cron) this.cron = schedule.cron
    if (schedule.timezone) this.timezone = schedule.timezone
    if (schedule.enabled) this.enabled = schedule.enabled
    if (schedule.lastRun) this.lastRun = schedule.lastRun
    if (schedule.nextRun) this.nextRun = schedule.nextRun
    if (schedule.params) this.params = schedule.params
  }
}
