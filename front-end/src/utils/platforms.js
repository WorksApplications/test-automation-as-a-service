const platforms = [{
  value: 'chrome',
  label: 'Chrome',
  icon: 'fa-chrome'
}, {
  value: 'firefox',
  label: 'Firefox',
  icon: 'fa-firefox'
}, {
  value: 'internet explorer',
  label: 'IE 11',
  icon: 'fa-internet-explorer'
}, {
  value: 'MicrosoftEdge',
  label: 'Edge',
  icon: 'fa-edge'
}, {
  value: 'Android',
  label: 'Android',
  icon: 'fa-android'
}, {
  value: 'iOS',
  label: 'iOS',
  icon: 'fa-apple'
}, {
  value: 'api',
  label: 'API',
  icon: 'fa-send'
}]

export const platformsCascade = [{
  value: 'desktop',
  label: 'Desktop',
  children: [{
    value: 'chrome',
    label: 'Chrome'
  }, {
    value: 'firefox',
    label: 'Firefox'
  }, {
    value: 'internet explorer',
    label: 'Internet Explorer'
  }, {
    value: 'MicrosoftEdge',
    label: 'Edge'
  }]
}, {
  value: 'mobile',
  label: 'Mobile',
  children: [{
    value: 'Android',
    label: 'Android'
  }, {
    value: 'iOS',
    label: 'iOS'
  }]
}, {
  value: 'api',
  label: 'API'
}]

export default {
  platforms,
  platformsCascade,
  isMobilePlatform: platform => (platform === 'iOS' || platform === 'Android'),
  isPlatformSupported: (platform, type) => {
    if (type === 'browser') {
      return (platform === 'chrome' ||
        platform === 'internet explorer' ||
        platform === 'MicrosoftEdge' ||
        platform === 'firefox')
    } else if (type === 'mobile') {
      return platform === 'Android'
    } else if (type === 'ios') {
      return platform === 'iOS'
    } else if (type === 'api') {
      return platform === 'api'
    }
  },
  getType: platform => {
    if (platform === 'chrome' ||
      platform === 'internet explorer' ||
      platform === 'MicrosoftEdge' ||
      platform === 'firefox') {
      return 'browser'
    } else if (platform === 'Android') {
      return 'mobile'
    } else if (platform === 'iOS') {
      return 'ios'
    } else if (platform === 'api') {
      return 'api'
    } else {
      return 'all'
    }
  },
  getVideoSize: nodeType => {
    if (nodeType === 'chrome' ||
      nodeType === 'windows' ||
      nodeType === 'firefox' ||
      nodeType === 'ios') {
      return {
        width: 1024,
        height: 576
      }
    } else if (nodeType === 'android') {
      return {
        width: 320,
        height: 576
      }
    }
  },
  platformToNodeType: (platform) => {
    if (platform === 'internet explorer' ||
      platform === 'MicrosoftEdge') {
      return 'windows'
    } else {
      return platform.toLowerCase()
    }
  }
}
