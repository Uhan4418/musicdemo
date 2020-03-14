import Vue from 'vue'
import App from './App.vue'
// 引入store文件
import store from './Store'
// 引入样式重置文件
import './style/reset.css'
// 引入动画样式
import 'animate.css'

// 引入iconfont图标
import 'style/icon/iconfont.css'
import router from './router/index'
import VueLazyload from 'vue-lazyload'

// 引入mint-ui框架
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

Vue.config.productionTip = false

// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,  // 预加载的百分比
  error: '/favicon.ico',  // 图片加载失败显示的图片
  loading: '/favicon.ico',  // 加载过程中的图片，建议使用gif图
  attempt: 1
})

new Vue({
  router,  // 注册router
  store,  // 注册store
  render: h => h(App)
}).$mount('#app')
