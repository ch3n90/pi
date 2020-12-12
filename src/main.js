import Vue from 'vue'
import App from './App'
import router from './router/menu'
import store from './util/vuexx'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
