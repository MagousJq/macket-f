import Vue from 'vue'
import Router from 'vue-router'
// 路由懒加载
const getComponent = (name) => () => import(`./views/${name}.vue`)

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: getComponent('Shell'),
      redirect: '/buffCsgo',
      children: [
        {
          path: 'buffCsgo',
          name: 'buffCsgo',
          component: getComponent('BuffCsgo')
        },
        {
          path: 'buffDota',
          name: 'buffDota',
          component: getComponent('BuffDota')
        },
        {
          path: 'igxeCsgo',
          name: 'igxeCsgo',
          component: getComponent('IgxeCsgo')
        },
        {
          path: 'igxeDota',
          name: 'igxeDota',
          component: getComponent('IgxeDota')
        },
        {
          path: 'chart',
          name: 'chart',
          component: getComponent('Chart')
        }
      ]
    },
    {
      path: '/testVue',
      name: 'testVue',
      component: getComponent('TestVue')
    },
    {
      path: '/learn',
      name: 'learnVue',
      component: getComponent('LearnVue')
    },
    {
      path: '/testForm',
      name: 'testForm',
      component: getComponent('TestForm')
    }
  ]
})
