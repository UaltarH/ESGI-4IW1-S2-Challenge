import { createRouter, createWebHistory } from 'vue-router';
import index from "@/pages/index.vue";
import Roles from '@/pages/admin/roles/index.vue';
import Auth from '@/pages/auth/login/index.vue';
import CustomTableExemple from "@/pages/admin/components/tableExemple.vue";
import ProductsPage from "@/pages/products/index.vue";
import AdminLayout from '@/pages/admin/index.vue';
import Logout from '@/pages/auth/logout/index.vue';
import Account from '@/pages/user/account/index.vue';
import Data from '@/pages/user/account/data/index.vue';
import Orders from '@/pages/user/account/orders/index.vue';
import Settings from '@/pages/user/account/settings/index.vue';

const routes = [
  { path: "/", component: index, name: "home"},
  { path: "/auth", component: Auth },
  { path: "/logout", component: Logout },
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
      { path: 'roles', component: Roles },
      { path: '', redirect: 'dashboard' },
    ]
  },

  {
    path: '/user',
    children: [
      {
        path: 'account', component: Account, name: 'account',
      },
      {
        path: 'data', component: Data, name: 'account-data'
      },
      {
        path: 'orders', component: Orders, name: 'account-orders',
      },
      {
        path: 'settings', component: Settings, name: 'account-settings',
      }
    ]
  },

  // Route par défaut (ou erreur 404)
  { path: '/:pathMatch(.*)*', redirect: '/' }, // Redirige toutes les routes non définies vers la page d'accueil
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
