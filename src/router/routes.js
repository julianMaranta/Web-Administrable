import { createRouter, createWebHistory } from 'vue-router';
import { checkAuth } from '../authenticator/auth';

const routes = [
  /* RUTAS ADMINISTRADOR - LOGIN */
  {
    path: '/login-admin',
    name: 'login-admin',
    component: () => import('../views/A_LoginView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador',
    name: 'plataforma-administrador',
    component: () => import('../views/A_PlataformaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-crear',
    name: 'plataforma-administrador-crear',
    component: () => import('../views/A_CreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-editar',
    name: 'plataforma-administrador-editar',
    component: () => import('../views/A_EditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-eliminar',
    name: 'plataforma-administrador-eliminar',
    component: () => import('../views/A_DeleteView.vue'),
    meta: { requiresAuth: true }
  },
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
