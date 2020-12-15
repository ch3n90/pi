import Vue from 'vue'
import Router from 'vue-router'
import Pi from '../components/pi/Pi'
// import SMMS from '../components/pi/smms/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/smms/main',
      // name: 'Pi',
      component: Pi,
      // redirect:"/smms/main",
      // children:[
      //   {
      //     path: '/smms/main',
      //     component: SMMS,

      //   },
        // {
        //   path: '/loading',
        //   component: Loading,
        // }
      // ]
    },
  ]
})