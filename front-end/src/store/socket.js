import socketio from 'socket.io-client'

export default {
  namespaced: true,
  state: {
    socket: null,
    preSocketId: null
  },
  actions: {
    initialSocket ({ state }) {
      state.socket = socketio(`http://${document.location.hostname}`)
    },
    connect ({ state }) {
      state.preSocketId = state.socket.id
    }
  }
}
