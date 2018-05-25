module.exports = {
  'Sanity check': (browser) => {
    const devServer = `${browser.globals.devServerURL}`
    browser
      .url(devServer)
      .waitForElementVisible('img[alt=logo]', 5000)
      .end()
  }
}
