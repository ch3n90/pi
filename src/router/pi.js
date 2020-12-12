import Vue from 'vue'
import Router from 'vue-router'
import Pi from '../components/pi/Pi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/pi',
      name: 'Pi',
      component: Pi,
      redirect:'/pi',
      children:[
        {
          path: '/pi',
          component: Pi,

        },
        // {
        //   path: '/loading',
        //   component: Loading,
        // }
      ]
    },
  ]
})