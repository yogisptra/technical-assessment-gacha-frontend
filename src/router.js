import { createRouter, createWebHistory } from 'vue-router';

import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Dashboard from './views/Dashboard.vue';
import Admin from './views/Admin.vue';

import Landing from './views/Landing.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { auth: true } },
  { path: '/admin', component: Admin, meta: { auth: true, admin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (to.meta.auth && !token) {
    next('/login');
  } else if (to.meta.guest && token) {
    next('/dashboard');
  } else if (to.meta.admin && (!user || !user.is_admin)) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
