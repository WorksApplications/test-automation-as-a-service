import { cloneDeep } from 'lodash'
import utilSelectCascade from '@/utils/selectCascade'
import utilTestcase from '@/utils/testcase'

const testcasesForTestjob = (testPlan, task, testcasesCascade) => {
  let testcasesTestPlan = cloneDeep(utilSelectCascade.arrayOfPathToObjects(
    testPlan.testcases,
    testcasesCascade
  ))
  return utilTestcase.pathsToLocators(
    task.testcases,
    task.platform,
    testcasesTestPlan
  )
}

export default {
  testjobFromTask (testPlan, task, testcasesCascade) {
    return {
      testPlanSerial: testPlan.serial,
      taskSerial: task.serial,
      name: `${task.name} (Task #${task.serial} of Test Plan #${testPlan.serial})`,
      branch: task.branch,
      url: task.environment.url,
      appUrl: task.appUrl,
      channel: task.channel.name,
      channelId: task.channel.id,
      testcases: testcasesForTestjob(testPlan, task, testcasesCascade),
      username: task.environment.username,
      password: task.environment.password,
      platform: task.platform,
      params: task.params
    }
  }
}
