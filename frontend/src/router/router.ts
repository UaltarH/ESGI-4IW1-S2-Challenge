import { createRouter, createWebHistory } from "vue-router";
import index from "@/pages/index.vue";
import Auth from "@/pages/auth/login/index.vue";
import ProductsPage from "@/pages/products/index.vue";
import AdminLayout from "@/pages/admin/index.vue";
import Logout from "@/pages/auth/logout/index.vue";
import Account from "@/pages/user/account/index.vue";
import Data from "@/pages/user/account/data/index.vue";
import Orders from "@/pages/user/account/orders/index.vue";
import Settings from "@/pages/user/account/settings/index.vue";
import Verify from "@/pages/auth/verify/index.vue";
import Error from "@/pages/errors/500.vue";
import Error403 from "@/pages/errors/403.vue";
import Error404 from "@/pages/errors/404.vue";
import { useUserStore } from "@/stores/user.ts";
import { role } from "@/dto/role.dto.ts";
import { UserService } from "@/composables/api/user.service.ts";
import {useNotificationStore} from "@/stores/notification.ts";
import { useCartStore } from "@/stores/cart.ts";

const routes = [
  { path: "/", component: index, name: "home" },
  {
    path: "/auth",
    component: Auth,
    name: "login",
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.user.id) {
        return { path: "/" };
      }
    },
  },
  { path: "/logout", component: Logout },
  { path: "/product/:id", component: () => import("@/pages/product/index.vue") },
  { path: "/products", component: ProductsPage, name: "products" },
  { path: "/verify/:token", component: Verify },

  {
    path: "/order",
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import('@/pages/order/index.vue'),
        meta: { requiresAuth: true },
        name: "order",
      },
      {
        path: "success",
        component: () => import('@/pages/order/success/index.vue'),
        meta: {
          requiresAuth: true,
          expectedQuery: ['session_id']
        },
        name: "order-success"
      },
      {
        path: "cancel",
        component: () => import('@/pages/order/cancel/index.vue'),
        meta: {
          requiresAuth: true,
          expectedQuery: ['session_id']
        },
        name: "order-cancel"
      }
    ]
  },

  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/admin/dashboard/index.vue"),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: "users",
        component: () => import("@/pages/admin/users/index.vue"),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: "products",
        component: () => import("@/pages/admin/products/index.vue"),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: "orders",
        component: () => import("@/pages/admin/orders/index.vue"),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: "stocks",
        component: () => import("@/pages/admin/stock/index.vue"),
        meta: { requiresAuth: true, isAdmin: true },
      },
      {
        path: "",
        redirect: "dashboard",
        meta: { requiresAuth: true, isAdmin: true },
      },
    ],
  },

  {
    path: "/user",
    children: [
      {
        path: "account",
        component: Account,
        name: "account",
        meta: { requiresAuth: true },
      },
      {
        path: "data",
        component: Data,
        name: "account-data",
        meta: { requiresAuth: true },
      },
      {
        path: "orders",
        component: Orders,
        name: "account-orders",
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        component: Settings,
        name: "account-settings",
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: "/500", component: Error },
  { path: "/403", component: Error403 },
  // Route par défaut (ou erreur 404)
  { path: "/:pathMatch(.*)*", component: Error404 },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve(async (to, from, next) => {
  const userStore = useUserStore();
  const { getUserById } = UserService();
  const notificationStore = useNotificationStore();

  if (to.meta.requiresAuth){
    if (!userStore.user.id) {
      next({
        path: "/auth",
        query: { redirect: to.fullPath },
      })
    } else {
      const status: number = await getUserById(
          userStore.user.id,
          (res: Response) => {
            return res.status;
          },
          {fields: ["firstname"]}
      );
      if(status === 401) {
        localStorage.removeItem("auth_token");
        useCartStore().$reset();
        userStore.token = null;
        notificationStore.add({
          message: 'Votre session a expirée, veuillez vous reconnecter',
          type: 'error',
          timeout: 3000
        });
        next("/auth");
      } else if(status === 200) {
        next();
      } else {
        notificationStore.add({
            message: 'Une erreur est survenue, veuillez réessayer ultérieurement',
            type: 'error',
            timeout: 3000
        });
        next("/500");
      }
    }
  }
  else if (to.meta.isAdmin) {
    if(userStore.user.role !== role.ADMIN) {
      next("/403");
    }
    else {
      await getUserById(
          userStore.user.id,
          (res: Response) => {
            if(res.status !== 200) {
              localStorage.removeItem("auth_token");
              userStore.token = null;
              next("/auth");
            }
            res.json().then((data) => {
              if(data.user.role !== role.ADMIN) {
                localStorage.removeItem("auth_token");
                userStore.token = null;
                next("/403");
              } else next();
            });
          },
          { fields: ["role"] }
      );
    }
  }
  else next();
});
