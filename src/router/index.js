import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './route'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/chat') {
    // 登录判断
  }
  next()
})

export default router
