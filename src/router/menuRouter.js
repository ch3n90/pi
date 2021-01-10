import Vue from 'vue'
import Router from 'vue-router'
import Auth from '../components/auth/Auth'
import M3nu from '../components/auth/M3nu'
import Smms from '../components/auth/Smms.vue'
import PostImage from '../components/auth/PostImage'
import Minio from '../components/auth/Minio'
import Updater from '../components/auth/settings/Updater'
import Settings from '../components/auth/settings/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth,
      redirect:'/m3nu',
      children:[
        {
          path: '/m3nu',
          component: M3nu,

        },
        {
          path: '/smms',
          component: Smms,
        },
        {
          path: '/postimage',
          component: PostImage,
        },
        {
          path: '/minio',
          component: Minio,
        },
        {
          path: '/settings',
          component: Settings,
        },
        {
          path: '/updater',
          component: Updater,
        }
      ]
    },
  ]
})