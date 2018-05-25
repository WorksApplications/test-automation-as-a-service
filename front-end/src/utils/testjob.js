export default {

  canBeStopped: (testjob) =>
    testjob.status !== 'Canceled' &&
    testjob.status !== 'Finished' &&
    testjob.status !== 'Error',

  isRunning: (testjob) => testjob.status === 'Running',
  isPending: (testjob) => testjob.status === 'Pending',
  isFinished: (testjob) => testjob.status === 'Finished',
  isCanceled: (testjob) => testjob.status === 'Canceled',
  isError: (testjob) => testjob.status === 'Error'

}
