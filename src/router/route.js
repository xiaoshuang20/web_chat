export const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login/login.vue'),
  },
  {
    path: '/chat',
    component: () => import('@/components/ChatApp.vue'),
  },
]
