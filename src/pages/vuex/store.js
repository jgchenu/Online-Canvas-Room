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
    identity: 'none',
    isOwner: false,
    room: {}
  },
  mutations: {
    changeStatus: (state, status) => {
      state.tunnelStatus = status
    },
    changeIdentityStatus: (state, status) => {
      state.identity = status;
    },
    changeOwnerStatus: (state, status) => {
      state.isOwner = status;
    },
    setRoom: (state, val) => {
      state.room = val
    }
  }
})

export default store
