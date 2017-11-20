/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:05 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 20:14:40
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/pages/index'
// 首页相关页面
import Home from '@/components/pages/Home/index'
import videoDetail from '@/components/pages/Home/videoDetail'

// 录制页相关页面
import record from '@/components/pages/Record/record'

// 用户相关页面
import user from '@/components/pages/User/user'
import login from '@/components/pages/User/login'

//错误页面
import error from '@/components/pages/error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/user/login',
      name:'login',
      component: login
    },
    {
      path: '/',
      name: 'First',
      component: index,
      children:[
        {
          path:'/',
          name:'index',
          component: Home
        },
        {
          path: '/record',
          name: 'record',
          component: record
        },
        {
          path: '/user',
          name: 'user',
          component: user
        },
        {
          path: '*',
          name: 'error',
          component: error
        }
      ]
    },
    {
      path:'/index/videoDetail/:video',
      name:'videoDetail',
      component: videoDetail,
      props:true
    }
    
  ]
})
