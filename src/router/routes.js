import { createRouter, createWebHistory } from 'vue-router';
import { checkAuth } from '../authenticator/auth';

const routes = [
  
  {
    path: '/',
    name: 'inicio',
    component: () => import('../views/Inicio.vue')
  },
 
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
];

// Crea el enrutador
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/*router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!checkAuth()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});*/


export default router;
