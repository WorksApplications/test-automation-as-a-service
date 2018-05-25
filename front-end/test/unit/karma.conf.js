var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function karmaConfig (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: [
      'mocha',
      'sinon-chai'
    ],
    reporters: [
      'spec',
      'coverage',
      'html'
    ],
    files: ['./index.js'],
    preprocessors: {
      './index.js': [
        'webpack',
        'sourcemap'
      ]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './reports/coverage',
      reporters: [
        {
          type: 'lcov',
          subdir: '.'
        }, {
          type: 'text-summary'
        }
      ]
    },
    htmlReporter: {
      outputDir: './test/unit/reports/karma',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: null,
      urlFriendlyName: false,
      reportName: 'karma-unit-test-summary',
      preserveDescribeNesting: false,
      foldAll: false
    }
  })
}
