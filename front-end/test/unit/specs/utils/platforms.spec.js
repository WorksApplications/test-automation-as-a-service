import utilsPlatforms from '@/utils/platforms.js'

describe('utils/platforms.js', () => {
  // Test cases
  it('isMobilePlatform()', () => {
    const fn = utilsPlatforms.isMobilePlatform
    // True
    expect(fn('iOS')).to.equal(true)
    expect(fn('Android')).to.equal(true)
    // False
    expect(fn('chrome')).to.equal(false)
    expect(fn('firefox')).to.equal(false)
    expect(fn('internet explorer')).to.equal(false)
    expect(fn('MicrosoftEdge')).to.equal(false)
    expect(fn('api')).to.equal(false)
  })
  it('isPlatformSupported()', () => {
    const fn = utilsPlatforms.isPlatformSupported
    // True
    expect(fn('chrome', 'browser')).to.equal(true)
    expect(fn('firefox', 'browser')).to.equal(true)
    expect(fn('internet explorer', 'browser')).to.equal(true)
    expect(fn('MicrosoftEdge', 'browser')).to.equal(true)
    expect(fn('Android', 'mobile')).to.equal(true)
    expect(fn('iOS', 'ios')).to.equal(true)
    expect(fn('api', 'api')).to.equal(true)
    // False
    expect(fn('chrome', 'mobile')).to.equal(false)
    expect(fn('chrome', 'ios')).to.equal(false)
    expect(fn('chrome', 'api')).to.equal(false)
    expect(fn('firefox', 'mobile')).to.equal(false)
    expect(fn('firefox', 'ios')).to.equal(false)
    expect(fn('firefox', 'api')).to.equal(false)
    expect(fn('internet explorer', 'mobile')).to.equal(false)
    expect(fn('internet explorer', 'ios')).to.equal(false)
    expect(fn('internet explorer', 'api')).to.equal(false)
    expect(fn('MicrosoftEdge', 'mobile')).to.equal(false)
    expect(fn('MicrosoftEdge', 'ios')).to.equal(false)
    expect(fn('MicrosoftEdge', 'api')).to.equal(false)
    expect(fn('Android', 'browser')).to.equal(false)
    expect(fn('Android', 'ios')).to.equal(false)
    expect(fn('Android', 'api')).to.equal(false)
    expect(fn('iOS', 'browser')).to.equal(false)
    expect(fn('iOS', 'mobile')).to.equal(false)
    expect(fn('iOS', 'api')).to.equal(false)
    expect(fn('api', 'browser')).to.equal(false)
    expect(fn('api', 'mobile')).to.equal(false)
    expect(fn('api', 'ios')).to.equal(false)
  })
  it('getType()', () => {
    const fn = utilsPlatforms.getType
    expect(fn('chrome')).to.equal('browser')
    expect(fn('firefox')).to.equal('browser')
    expect(fn('internet explorer')).to.equal('browser')
    expect(fn('MicrosoftEdge')).to.equal('browser')
    expect(fn('Android')).to.equal('mobile')
    expect(fn('iOS')).to.equal('ios')
    expect(fn('api')).to.equal('api')
    expect(fn('all')).to.equal('all')
  })
  it('getVideoSize()', () => {
    const fn = utilsPlatforms.getVideoSize
    expect(fn('ios')).to.have.all.keys('width', 'height')
    expect(fn('android')).to.have.all.keys('width', 'height')
    expect(fn('chrome')).to.have.all.keys('width', 'height')
    expect(fn('firefox')).to.have.all.keys('width', 'height')
    expect(fn('windows')).to.have.all.keys('width', 'height')
    expect(fn('api')).to.equal(undefined)
  })
  it('platformToNodeType()', () => {
    const fn = utilsPlatforms.platformToNodeType
    expect(fn('iOS')).to.equal('ios')
    expect(fn('Android')).to.equal('android')
    expect(fn('chrome')).to.equal('chrome')
    expect(fn('firefox')).to.equal('firefox')
    expect(fn('internet explorer')).to.equal('windows')
    expect(fn('MicrosoftEdge')).to.equal('windows')
    expect(fn('api')).to.equal('api')
  })
})
