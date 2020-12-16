import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Pi from './Pi'
import router from '../../router/piRouter.js'
import store from '../../util/vuexx.js'


Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  el: '#app',
  render: h => h(Pi),
  store
}).$mount('#app')
