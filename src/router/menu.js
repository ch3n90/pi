import Vue from 'vue'
import Router from 'vue-router'
import Menu from '../components/Menu'
import SMMS from '@/components/auth/SMMS'
import PostImage from '@/components/auth/PostImage'

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
        {
          path: '/smms',
          component: SMMS,
        },
        {
          path: '/postimage',
          component: PostImage,
        },
        // {
        //   path: '/loading',
        //   component: Loading,
        // }
      ]
    },
  ]
})