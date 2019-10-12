import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VCharts from 'v-charts'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import locale from 'view-design/dist/locale/zh-CN'
import '@/theme/index.less'
import './utils/watermark'

Vue.config.productionTip = false

Vue.use(iView, { locale })
Vue.use(VCharts)

// const initWaterMark = function () {
//   window.WaterMark.mark({
//     text: "江前江前江前江前江前",
//     zIndex: 9999,
//     opacity: 0.05
//   })
// }

new Vue({
  router,
  store,
  // mounted () {
  //   setTimeout(() => initWaterMark(), 800)
  // },
  render: h => h(App)
}).$mount('#app')
