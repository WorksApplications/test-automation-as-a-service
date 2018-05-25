import utilsPushMessages from '@/utils/pushMessages.js'

describe('utils/pushMessages.js', () => {
  beforeEach(() => {
    const el = document.querySelector('.el-message')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
    if (el.__vue__) {
      el.__vue__.$destroy()
    }
  })
  afterEach(() => {
    const el = document.querySelector('.el-message')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
    if (el.__vue__) {
      el.__vue__.$destroy()
    }
  })

  // Test cases
  it('info()', () => {
    const fn = utilsPushMessages.info
    fn('TaaS is updated!')
    const message = document.querySelector('.el-message')
    const messageContent = document.querySelector('.el-message__content')
    expect(message.__vue__.type).to.equal('info')
    expect(messageContent.textContent).to.equal('TaaS is updated!')
  })
  it('success()', () => {
    const fn = utilsPushMessages.success
    fn('Your test job is executed without error!')
    const message = document.querySelector('.el-message')
    const messageContent = document.querySelector('.el-message__content')
    expect(message.__vue__.type).to.equal('success')
    expect(messageContent.textContent).to.equal('Your test job is executed without error!')
  })
  it('warning()', () => {
    const fn = utilsPushMessages.warning
    fn('This is dangerous. I am warning you!')
    const message = document.querySelector('.el-message')
    const messageContent = document.querySelector('.el-message__content')
    expect(message.__vue__.type).to.equal('warning')
    expect(messageContent.textContent).to.equal('This is dangerous. I am warning you!')
  })
  it('error()', () => {
    const fn = utilsPushMessages.error
    fn('Your scheduled job did not go well!')
    const message = document.querySelector('.el-message')
    const messageContent = document.querySelector('.el-message__content')
    expect(message.__vue__.type).to.equal('error')
    expect(messageContent.textContent).to.equal('Your scheduled job did not go well!')
  })
})
