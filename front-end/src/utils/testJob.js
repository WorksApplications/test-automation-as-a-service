import _ from 'lodash'
import { getTestResultsForJob } from '@/api/testresults.js'

/*
verdict = {
  status: 'passed' or 'resolved' or 'failed' or 'running' or 'pending' or 'canceled' or 'error',
  description: 'a brief description of the status'
}
 */
const getVerdict = (status, result, resolve) => {
  if (status === 'Finished') {
    if (result.total === result.passed) {
      const passedCount = result.total
      return {
        status: 'passed',
        description: `${passedCount} test cases passed`
      }
    } else if (resolve && resolve.resolved === true) {
      return {
        status: 'resolved',
        description: `Resolved`
      }
    } else {
      const failedCount = result.total - result.passed
      const totalCount = result.total
      return {
        status: 'failed',
        description: `${failedCount} out of ${totalCount} test cases failed`
      }
    }
  } else if (status === 'Running') {
    const runningCount = Math.min(Math.max(result.passed + result.canceled + result.failed, 0) + 1, result.total)
    const totalCount = result.total
    return {
      status: 'running',
      description: `Running test case ${runningCount}/${totalCount}`
    }
  } else if (status === 'Pending') {
    return {
      status: 'pending',
      description: 'Pending'
    }
  } else if (status === 'Canceled') {
    return {
      status: 'canceled',
      description: 'Canceled'
    }
  } else {
    return {
      status: 'error',
      description: 'System error'
    }
  }
}

/*
times = {
  create: ISOString of time created,
  start: ISOString of time started,
  finish: ISOString of time finished
}
 */
const getTimes = (timeCreate, timeStart, timeFinish) => {
  return {
    create: timeCreate,
    start: timeStart,
    finish: timeFinish
  }
}

const getRerunAllParams = (testJob) => {
  if (testJob === undefined) {
    return undefined
  }
  let newParams = _.cloneDeep(testJob.params)
  newParams.name += ` (Rerun all from #T${testJob.serial})`
  return newParams
}

const getRerunFailedParams = async (testJob) => {
  const failedOnly = testCase => testCase.status !== 'PASSED'
  const byLocator = testCase => testCase.locator
  if (testJob === undefined) {
    return undefined
  }
  const results = await getTestResultsForJob(testJob.serial)
  if (results.testresults === undefined) {
    return undefined
  }
  const failedTestCases = results.testresults.filter(failedOnly).map(byLocator)
  if (failedTestCases.length === 0) {
    return undefined
  }
  let newParams = _.cloneDeep(testJob.params)
  newParams.name += ` (Rerun failed from #T${testJob.serial})`
  newParams.testcases = failedTestCases
  return newParams
}

export default {
  getVerdict,
  getTimes,
  getRerunAllParams,
  getRerunFailedParams
}
