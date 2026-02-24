import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/bullets',
    name: 'Bullets',
    component: () => import('@/views/Bullets.vue'),
  },
  {
    path: '/bullets/:id',
    name: 'BulletDetail',
    component: () => import('@/views/BulletDetail.vue'),
  },
  {
    path: '/positions',
    name: 'Positions',
    component: () => import('@/views/Positions.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
