export const formatTestjob = (testjob) => {
  return testjob
}

export const formatSchedule = (schedule) => {
  schedule.params = formatTestjob(schedule.params)
  return schedule
}

export const formatGroups = (group) => {
  return group
}
