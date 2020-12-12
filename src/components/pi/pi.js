import Vue from 'vue'
import Pi from './Pi'
import router from '../../router/pi'
import store from '../../util/vuexx'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Pi),
  store
}).$mount('#app')
