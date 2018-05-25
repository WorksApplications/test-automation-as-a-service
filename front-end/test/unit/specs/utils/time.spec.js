import utilsTime from '@/utils/time.js'

const backToTime = (seconds, dateCurrent) => new Date(Date.parse(dateCurrent) - seconds * 1000).toISOString()

describe('utils/time.js', () => {
  // Test cases
  it('dateDuration()', () => {
    const fn = utilsTime.dateDuration
    const dateCurrent = new Date().toISOString()
    const testCases = [{
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-22T09:55:25.425Z',
      result: '3s'
    }, {
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-22T09:58:22.425Z',
      result: '3m'
    }, {
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-22T12:55:22.425Z',
      result: '3h'
    }, {
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-25T09:55:22.425Z',
      result: '3d'
    }, {
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-22T09:55:22.425Z',
      result: '0s'
    }, {
      dateCurrent,
      dateStart: '2018-03-22T09:55:22.425Z',
      dateEnd: '2018-03-23T09:58:22.425Z',
      result: '1d 3m'
    }, {
      dateCurrent,
      dateStart: backToTime(86400, dateCurrent),
      result: '1d'
    }]
    testCases.forEach(testCase => {
      expect(fn(testCase.dateCurrent, testCase.dateStart, testCase.dateEnd)).to.equal(testCase.result)
    })
  })
  it('dateDisplay()', () => {
    const fn = utilsTime.dateDisplay
    const dateCurrent = new Date().toISOString()
    const testCases = [{
      dateCurrent,
      date: dateCurrent,
      result: '0s ago'
    }, {
      dateCurrent,
      date: backToTime(1, dateCurrent),
      result: '1s ago'
    }, {
      dateCurrent,
      date: backToTime(2, dateCurrent),
      result: '2s ago'
    }, {
      dateCurrent,
      date: backToTime(17, dateCurrent),
      result: '17s ago'
    }, {
      dateCurrent,
      date: backToTime(60, dateCurrent),
      result: '1m ago'
    }, {
      dateCurrent,
      date: backToTime(117, dateCurrent), // 1m 57s
      result: '1m ago'
    }, {
      dateCurrent,
      date: backToTime(244, dateCurrent), // 4m 4s
      result: '4m ago'
    }, {
      dateCurrent,
      date: backToTime(3607, dateCurrent), // 1h 7s
      result: '1h ago'
    }, {
      dateCurrent,
      date: backToTime(7199, dateCurrent), // 1h 59m 59s
      result: '1h ago'
    }, {
      dateCurrent,
      date: backToTime(7200, dateCurrent), // 2h
      result: '2h ago'
    }, {
      dateCurrent,
      date: backToTime(86399, dateCurrent), // 23h 59m 59s
      result: '23h ago'
    }, {
      dateCurrent,
      date: backToTime(86400, dateCurrent), // 1d
      result: '1d ago'
    }, {
      dateCurrent,
      date: backToTime(864000, dateCurrent), // 10d
      result: '10d ago'
    }]
    testCases.forEach(testCase => {
      expect(fn(testCase.dateCurrent, testCase.date)).to.equal(testCase.result)
    })
  })
  it('dateString()', () => {
    const fn = utilsTime.dateString
    const testCases = [{
      date: '2018-03-14T10:56:12.925Z',
      result: '2018-03-14'
    }]
    testCases.forEach(testCase => {
      expect(fn(testCase.date)).to.equal(testCase.result)
    })
  })
  it('datetimeString()', () => {
    const fn = utilsTime.datetimeString
    const testCases = [{
      date: '2018-03-14T10:56:12.925Z',
      result: '2018-03-14 10:56:12'
    }]
    testCases.forEach(testCase => {
      expect(fn(testCase.date)).to.equal(testCase.result)
    })
  })
})
