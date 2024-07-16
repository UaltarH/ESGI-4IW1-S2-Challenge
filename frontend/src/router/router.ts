import { createRouter, createWebHistory } from 'vue-router';
import index from "@/pages/index.vue";
import Roles from '@/pages/admin/roles/index.vue';
import Auth from '@/pages/auth/login/index.vue';
import CustomTableExemple from "@/pages/admin/components/tableExemple.vue";
import ProductsPage from "@/pages/products/index.vue";
import AdminLayout from '@/pages/admin/index.vue';

const routes = [
  { path: "/", component: index },
  { path: "/auth", component: Auth },
  { path: "/components/table", component: CustomTableExemple },
  { path: "/product/:id", component: () => import('@/pages/product/index.vue') },
  { path: "/products", component: ProductsPage },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: () => import('@/pages/admin/dashboard/index.vue') },
      { path: 'users', component: () => import('@/pages/admin/users/index.vue') },
      { path: 'users/:id', component: () => import('@/pages/admin/users/show/index.vue') },
      { path: 'products', component: () => import('@/pages/admin/products/index.vue') },
      { path: 'products/:id', component: () => import('@/pages/admin/products/show/index.vue') },
      { path: 'orders', component: () => import('@/pages/admin/orders/index.vue') },
      { path: 'roles', component: Roles },
      { path: '', redirect: 'dashboard' },
    ]
  },

  // Route par défaut (ou erreur 404)
  { path: '/:pathMatch(.*)*', redirect: '/' }, // Redirige toutes les routes non définies vers la page d'accueil
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
