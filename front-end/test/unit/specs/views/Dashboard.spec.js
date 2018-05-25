import { createTest, destroyVM } from '../../util'
import Dashboard from '@/views/Dashboard.vue'

describe('views/Dashboard.vue', () => {
  let vm
  afterEach(() => {
    destroyVM(vm)
  })

  // Test cases
  it('should be mounted correctly', done => {
    vm = createTest(Dashboard)
    done()
  })
})
