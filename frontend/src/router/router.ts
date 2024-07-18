import { createRouter, createWebHistory } from 'vue-router';
import index from "@/pages/index.vue";
import Roles from '@/pages/admin/roles/index.vue';
import Auth from '@/pages/auth/login/index.vue';
import ProductsPage from "@/pages/products/index.vue";
import AdminLayout from '@/pages/admin/index.vue';
import Logout from '@/pages/auth/logout/index.vue';
import Account from '@/pages/user/account/index.vue';
import Data from '@/pages/user/account/data/index.vue';
import Orders from '@/pages/user/account/orders/index.vue';
import Settings from '@/pages/user/account/settings/index.vue';
import Error403 from '@/pages/errors/403.vue';
import Error404 from '@/pages/errors/404.vue';
import { useUserStore } from "@/stores/user.ts";
import { role } from "@/dto/role.dto.ts";

const routes = [
  { path: "/", component: index, name: "home"},
  {
    path: "/auth",
    component: Auth,
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.user.id) {
        return { path: '/' };
      }
    }
  },
  { path: "/logout", component: Logout, meta: { requiresAuth: true }, },
  { path: "/product/:id", component: () => import('@/pages/product/index.vue') },
  { path: "/products", component: ProductsPage },

  { path: "/order", component: () => import('@/pages/order/index.vue'), meta: { requiresAuth: true }, name: "order" },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/admin/dashboard/index.vue'),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: 'users',
        component: () => import('@/pages/admin/users/index.vue'),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: 'products',
        component: () => import('@/pages/admin/products/index.vue'),
        meta: { requiresAuth: true, isAdmin: true }
      },
      {
        path: 'orders',
        component: () => import('@/pages/admin/orders/index.vue'),
        meta: { requiresAuth: true, isAdmin: true }
      },
      {
        path: '',
        redirect: 'dashboard',
        meta: { requiresAuth: true, isAdmin: true }
      },
    ]
  },

  {
    path: '/user',
    children: [
      {
        path: 'account', component: Account, name: 'account', meta: { requiresAuth: true },
      },
      {
        path: 'data', component: Data, name: 'account-data', meta: { requiresAuth: true },
      },
      {
        path: 'orders', component: Orders, name: 'account-orders', meta: { requiresAuth: true },
      },
      {
        path: 'settings', component: Settings, name: 'account-settings', meta: { requiresAuth: true },
      }
    ]
  },

  { path: '/403', component: Error403 },
  // Route par défaut (ou erreur 404)
  { path: '/:pathMatch(.*)*', component: Error404 },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.user.id) {
    return {
      path: '/auth',
      query: { redirect: to.fullPath },
    }
  }
  if (to.meta.isAdmin && !(userStore.user.role === role.ADMIN)) {
    return {
      path: '/403',
    }
  }
});