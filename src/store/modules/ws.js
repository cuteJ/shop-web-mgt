import Vue from 'vue'

const ws = {
  state: {
    wsData: {
      hasNewMsg: false,
    },
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    }
  },
  mutations: {
    SET_WSDATA(state, data) {
      state.wsData.hasNewMsg = data.hasNewMsg
    },
    RESET_WSDATA(state, data) {
      state.wsData.hasNewMsg = false
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    AskRobot({rootGetters}, data) {
      return new Promise((resolve, reject) => {
        console.log('Ask robot msg', data);
        const payLoad = {
          type: 'robot',
          username: rootGetters.loginName,
          data: data
        };
        Vue.prototype.$socket.sendObj(payLoad)
        resolve(1)
      })
    },
    SendChatMsg({rootGetters}, data) {
      return new Promise((resolve, reject) => {
        console.log('Send chat msg', data);
        const payLoad = {
          type: 'chat',
          username: rootGetters.loginName,
          avatar: rootGetters.avatar,
          data: data
        };
        Vue.prototype.$socket.sendObj(payLoad)
        resolve(1)
      })
    },
    MessageRead({commit, state}, data) {
      commit('RESET_WSDATA', {})
    },
  }
};

export default ws
