
import { MenuItem } from 'electron'
import Vue from 'vue'
import Router from 'vue-router'
import Menu from '../components/Menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Menu',
      component: Menu,
      redirect:'/menu',
      children:[
        {
          path: '/menu',
          component: Menu,

        },
        // {
        //   path: '/register',
        //   component: Register,
        // },
        // {
        //   path: '/reset',
        //   component: ResetPasswd,
        // },
        // {
        //   path: '/loading',
        //   component: Loading,
        // }
      ]
    },
  ]
})