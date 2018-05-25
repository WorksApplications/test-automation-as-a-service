import utilsUrl from '@/utils/url.js'

describe('utils/url.js', () => {
  // Test cases
  describe('getFullUrl()', () => {
    const fn = utilsUrl.getFullUrl
    it('should return an URL with path only', () => {
      const prefix = window.location.href.split('#')[0]
      const fullUrl = fn('/dashboard', {}, '')
      expect(fullUrl).to.equal(`${prefix}#/dashboard`)
    })
  })

  describe('getRelativeUrl()', () => {
    const fn = utilsUrl.getRelativeUrl
    it('should return an URL with path only', () => {
      const relativeUrl = fn('/dashboard', {}, '')
      expect(relativeUrl).to.equal('/dashboard')
    })

    it('should return an URL with path and query only', () => {
      const relativeUrl = fn('/dashboard', {
        branch: 'develop',
        subsystemsToShow: [
          'collaboration.distribution.',
          'collaboration.projects.'
        ]
      }, '')
      expect(relativeUrl).to.equal('/dashboard?branch=develop&subsystemsToShow=collaboration.distribution.%2Ccollaboration.projects.')
    })
  })
})
