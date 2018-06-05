import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//引入wafer跟提示api
var qcloud = require("../../wafer/index");
var config = require("../../config");


const store = new Vuex.Store({
  state: {
    tunnel: new qcloud.Tunnel(config.service.tunnelUrl),
    tunnelStatus: 'closed',
    roomState: 'none'
  },
  mutations: {
    changeStatus: (state, status) => {
      state.tunnelStatus = status
    },
    changeRoomStatus: (state, status) => {
      state.roomState = status
    }

  }
})

export default store
