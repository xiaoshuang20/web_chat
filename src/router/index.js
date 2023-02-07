import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './route'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/chat') {
    // 登录判断
    let user = JSON.parse(window.sessionStorage.getItem('current_user'))
    if (!user) next('/login')
  }
  next()
})

export default router
