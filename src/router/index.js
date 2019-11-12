import Vue from 'vue'
import Router from 'vue-router'
import imageMain from '@/components/imageMain'
import login from '@/components/login'
import explainAnnotation from '@/components/explainAnnotation'

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
    },
    {
      path: '/explainAnnotation',
      name: 'explainAnnotation',
      component: explainAnnotation,
      meta: {
        isLogin: true
      }
    }
  ]
})
