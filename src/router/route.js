export const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/components/ChatApp.vue'),
  },
]
