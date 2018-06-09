import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: 'Online画室',
    navigationBarBackgroundColor: '#6A7D8E',
    enablePullDownRefresh:true
  }
}
