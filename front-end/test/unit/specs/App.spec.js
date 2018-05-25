import { createTest, destroyVM } from '../util'
import App from '@/App.vue'

describe('App.vue', () => {
  let vm
  afterEach(() => {
    destroyVM(vm)
  })

  // Test cases
  it('should be mounted correctly', done => {
    vm = createTest(App)
    done()
  })
})
