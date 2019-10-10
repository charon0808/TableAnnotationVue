import Vue from 'vue'
import Router from 'vue-router'
import imageMain from '@/components/imageMain'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: login,
      component: login,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/imageMain',
      name: 'imageMain',
      component: imageMain,
      meta: {
        isLogin: true
      }
    }
  ]
})
