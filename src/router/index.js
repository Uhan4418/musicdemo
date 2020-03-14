import Vue from 'vue'
import VueRouter from 'vue-router'

// 同步方式引入路由
import Recommend from '../components/Recommend/index.vue'
import Singer from '../components/Singer/index.vue'
import Rank from '../components/Rank/index.vue'
import My from '../components/My/'
import Detail from 'components/Detail/index.vue'

// 异步方式引入路由  即路由懒加载,将组件实现按需引入
// const Recommend = ()=>import('../components/Recommend/index.vue')
// const Singer = ()=>import('../components/Singer/index.vue')
// const Rank = ()=>import('../components/Rank/index.vue')
// const My = ()=>import('../components/My/')
// const Detail = ()=>import('components/Detail/index.vue')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      // name用于缓存页面
      name: "recommend",
      path: '/recommend',
      component: Recommend
    },
    {
      // name用于缓存页面
      name: "singer",
      path: '/singer',
      component: Singer,
      children: [
        {
          path:':singermid',  // 使用动态路由 歌手的mid
          name:'detail',
          component:Detail
        }
      ]
    },
    {
      // name用于缓存页面
      name: "rank",
      path: '/rank',
      component: Rank
    },
    {
      path: '/my',
      component: My
    },
    //重定向
    {
      path: '/',
      redirect: '/recommend'
    }

  ]
})

export default router
