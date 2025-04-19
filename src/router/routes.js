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
  /* RUTAS ADMINISTRADOR - INICIO */
  {
    path: '/plataforma-administrador',
    name: 'plataforma-administrador',
    component: () => import('../views/A_PlataformaView.vue'),
    meta: { requiresAuth: true }
  },
  /* RUTAS ADMINISTRADOR - EXCEL */

  {
    path: '/descargar-informe',
    name: 'descargar-informe',
    component: () => import('../views/A_ExcelView.vue'),
    meta: { requiresAuth: true }
  },
  /* RUTAS ADMINISTRADOR - CREAR */
  {
    path: '/plataforma-administrador-crear',
    name: 'plataforma-administrador-crear',
    component: () => import('../views/A_CreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-crear-alquiler',
    name: 'plataforma-administrador-crear-alquiler',
    component: () => import('../views/A_CreateAlquilerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-crear-venta',
    name: 'plataforma-administrador-crear-venta',
    component: () => import('../views/A_CreateVentaView.vue'),
    meta: { requiresAuth: true }
  },
  /* RUTAS ADMINISTRADOR - EDITAR */
  {
    path: '/plataforma-administrador-editar',
    name: 'plataforma-administrador-editar',
    component: () => import('../views/A_EditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-editar-alquiler',
    name: 'plataforma-administrador-editar-alquiler',
    component: () => import('../views/A_EditAlquilerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-editar-venta',
    name: 'plataforma-administrador-editar-venta',
    component: () => import('../views/A_EditVentaView.vue'),
    meta: { requiresAuth: true }
  },
  /* RUTAS ADMINISTRADOR - ELIMINAR */
  {
    path: '/plataforma-administrador-eliminar',
    name: 'plataforma-administrador-eliminar',
    component: () => import('../views/A_DeleteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-eliminar-alquiler',
    name: 'plataforma-administrador-eliminar-alquiler',
    component: () => import('../views/A_DeleteAlquilerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plataforma-administrador-eliminar-venta',
    name: 'plataforma-administrador-eliminar-venta',
    component: () => import('../views/A_DeleteVentaView.vue'),
    meta: { requiresAuth: true }
  },
  /* RUTAS CLIENTE - INICIO */
  {
    path: '/',
    name: 'inicio',
    component: () => import('../views/Inicio.vue')
  },
  {
    path: '/propiedad/:type/:id',
    name: 'propiedad',
    component: () => import('../views/PropertyDetail.vue')
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
