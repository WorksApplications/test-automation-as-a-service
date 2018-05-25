import utilsPropsValidator from '@/utils/propsValidator.js'

describe('utils/propsValidator.js', () => {
  // Test cases
  it('branch()', () => {
    const fn = utilsPropsValidator.branch
    // True
    expect(fn('develop')).to.equal(true)
    expect(fn('TaaS_qa_qe_2018.01')).to.equal(true)
    // False
    expect(fn('master')).to.equal(false)
    expect(fn('ticket-410426')).to.equal(false)
    expect(fn('this-is-a-random-name')).to.equal(false)
  })
  it('viewType()', () => {
    const fn = utilsPropsValidator.viewType
    // True
    expect(fn('live')).to.equal(true)
    expect(fn('replay')).to.equal(true)
    // False
    expect(fn('api')).to.equal(false)
    expect(fn('notVideo')).to.equal(false)
  })
  it('size()', () => {
    const fn = utilsPropsValidator.size
    // True
    expect(fn('mini')).to.equal(true)
    expect(fn('small')).to.equal(true)
    expect(fn('medium')).to.equal(true)
    // False
    expect(fn('large')).to.equal(false)
    expect(fn('tiny')).to.equal(false)
    expect(fn('normal')).to.equal(false)
  })
  it('type()', () => {
    const fn = utilsPropsValidator.type
    // True
    expect(fn('default')).to.equal(true)
    expect(fn('primary')).to.equal(true)
    expect(fn('success')).to.equal(true)
    expect(fn('info')).to.equal(true)
    expect(fn('warning')).to.equal(true)
    expect(fn('danger')).to.equal(true)
    // False
    expect(fn('error')).to.equal(false)
    expect(fn('warn')).to.equal(false)
    expect(fn('pass')).to.equal(false)
    expect(fn('secondary')).to.equal(false)
  })
})
