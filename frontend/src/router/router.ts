import { createRouter, createWebHistory } from "vue-router";
import index from "../pages/index.vue";
import Roles from "../pages/admin/roles/index.vue";

const routes = [
  { path: "/", component: index },
  { path: "/admin/roles", component: Roles },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
