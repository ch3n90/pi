import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router/menuRouter'
import store from './util/vuexx'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  el:'#app',
  render: h => h(App),
  store
}).$mount('#app')
