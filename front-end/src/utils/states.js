export const states = {
  new: {
    label: 'New',
    value: 'new',
    type: ''
  },
  'in progress': {
    label: 'In Progress',
    value: 'in progress',
    type: 'success'
  },
  finished: {
    label: 'Finished',
    value: 'finished',
    type: 'info'
  },
  destructed: {
    label: 'Destructed',
    value: 'destructed',
    type: 'danger'
  }
}

export default {
  states,
  isNew: function (state) {
    return state === states.new.value
  },
  isInProgress: function (state) {
    return state === states['in progress'].value
  },
  isClosed: function (state) {
    return state === states.finished.value || state === states.destructed.value
  }
}
