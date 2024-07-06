import {createRouter, createWebHistory} from 'vue-router'
import index from "@/pages/index.vue";
import Roles from '@/pages/admin/roles/index.vue';
import Register from '@/pages/auth/register/index.vue';
import CustomTableExemple from "@/pages/admin/components/tableExemple.vue";
import ArticlesPage from "@/pages/articles/index.vue";

const routes = [
    { path: "/", component: index },
    { path: "/admin/roles", component: Roles},
    { path: "/admin/dashboard", component: () => import('@/pages/admin/dashboard/index.vue')},
    { path: "/register", component: Register},
    { path: "/components/table", component: CustomTableExemple },
    { path: "/article/:id", component: () => import('@/pages/article/index.vue') },
    { path: "/articles", component: ArticlesPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
