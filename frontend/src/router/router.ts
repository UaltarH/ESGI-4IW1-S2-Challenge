import {createRouter, createWebHistory} from 'vue-router'
import index from "@/pages/index.vue";
import Roles from '@/pages/admin/roles/index.vue';
import Auth from '@/pages/auth/login/index.vue';
import CustomTableExemple from "@/pages/admin/components/tableExemple.vue";
import ProductsPage from "@/pages/products/index.vue";

const routes = [
    { path: "/", component: index, name: "home"},
    { path: "/admin/roles", component: Roles},
    { path: "/admin/dashboard", component: () => import('@/pages/admin/dashboard/index.vue')},
    { path: "/auth", component: Auth, name: "auth"},
    { path: "/components/table", component: CustomTableExemple },
    { path: "/product/:id", component: () => import('@/pages/product/index.vue') },
    { path: "/products", component: ProductsPage, name: "products" },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
