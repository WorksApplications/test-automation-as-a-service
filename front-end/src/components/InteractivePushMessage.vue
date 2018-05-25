<script>

import { Message, Loading } from 'element-ui'
import { promiseThen } from '@/utils'

const pushMessage = (message, type) => Message({
  showClose: true,
  message: message,
  type: type
})

export const info = (message = 'Submitting...') => pushMessage(message, 'info')

export const success = (message = 'Success') => pushMessage(message, 'success')

export const error = (message = 'Error') => pushMessage(message, 'error')

export const warning = (message = 'Warning') => pushMessage(message, 'warning')

export const asyncMessage = (message, type = 'info') => promiseThen(pushMessage, [message, type])

export class SubmitFlow {
  constructor (target = document.body) {
    this.target = target
  }

  submitting (message = 'Submitting...') {
    const target = this.target
    this.waiting = info(message)
    if (target) { this.loading = Loading.service({ target: target }) }
  }

  success (message = 'Submitted!') {
    if (this.waiting) this.waiting.close()
    if (this.loading) this.loading.close()
    success(message)
  }

  fail (message = 'Submit failed!') {
    if (this.waiting) this.waiting.close()
    if (this.loading) this.loading.close()
    error(message)
  }

  promiseSuccess (message = 'Submitted!') {
    const success = this.success.bind(this)
    return promiseThen(success, message)
  }

  promiseFail (message = 'Submit failed!') {
    const fail = this.fail.bind(this)
    return promiseThen(fail, message)
  }
}

export const submitNotice = async (promise, target = document.body,
  messages = ['Submitting...', 'Submitted!', 'Submit with error!']) => {
  let waiting = null
  let loading = null

  const submitting = (message = messages[0]) => {
    if (message !== null) waiting = info(message)
    if (target) loading = Loading.service({ target: target })
  }

  const popSuccess = (message = messages[1]) => {
    if (waiting) waiting.close()
    if (loading) loading.close()
    if (message !== null) success(message)
  }

  const popFail = (message = messages[2]) => {
    if (waiting) waiting.close()
    if (loading) loading.close()
    if (message !== null) error(message)
  }

  submitting()
  try {
    const res = await promise
    popSuccess()
    return res
  } catch (response) {
    if (response.status !== 401) {
      popFail()
      throw response
    } else {
      waiting && waiting.close()
      loading && loading.close()
      throw response
    }
  }
}

export class LoadingDataFlow {
  constructor (target = document.body) {
    this.target = target
  }

  fetching () {
    const target = this.target
    this.loading = Loading.service({ target: target })
  }

  promiseFinish () {
    const loading = this.loading
    const closeLoading = () => {
      if (loading) loading.close()
    }
    return promiseThen(closeLoading)
  }

  fail (message = 'Network error!') {
    if (this.loading) this.loading.close()
    error(message)
  }

  promiseFail (message = 'Network error!') {
    const fail = this.fail.bind(this)
    return promiseThen(fail, message)
  }
}

export const loadingData = async (promise, target = document.body,
  messages = ['Loading...', '', 'Load failed!']) => {
  let loading = null

  const fetching = (message = messages[0]) => {
    if (target) {
      loading = Loading.service({ target: target })
    }
  }

  const popFail = (message = messages[2]) => {
    if (loading) loading.close()
    error(message)
  }

  fetching()
  try {
    const res = await promise
    if (loading) loading.close()
    return res
  } catch (response) {
    if (response.status !== 401) {
      popFail()
      throw response.body
    } else {
      loading && loading.close()
      throw response.body
    }
  }
}

</script>
