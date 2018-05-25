import { Message } from 'element-ui'

const openPushMessage = (type, message) => Message({ message, type })

export default {
  // Basic type of push messages
  info: message => openPushMessage('info', message),
  success: message => openPushMessage('success', message),
  warning: message => openPushMessage('warning', message),
  error: message => openPushMessage('error', message)
}
