import Vue from 'vue'
import Pi from './Pi'
import router from '../../router/pi.js'
import store from '../../util/vuexx.js'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Pi),
  store
}).$mount('#app')
