import Vue from 'vue'
import App from './App.vue'
import store from './store'
// 导入全局样式表
import './assets/css/index.css'
import './assets/js/canvas'
//注册自定义指令
import Directive from './directives/index' //因为我把自定义指令封装成一个函数了,只要调用它,传入Vue就行
Directive(Vue)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')