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
      redirect: '/csgo',
      children: [
        {
          path: 'csgo',
          name: 'csgo',
          component: getComponent('Csgo')
        },
        {
          path: 'dota',
          name: 'dota',
          component: getComponent('Dota')
        },
        {
          path: 'igxe',
          name: 'igxe',
          component: getComponent('Igxe')
        },
        {
          path: 'chart',
          name: 'chart',
          component: getComponent('Chart')
        },
        {
          path: 'testForm',
          name: 'testForm',
          component: getComponent('TestForm')
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
    }
  ]
})
