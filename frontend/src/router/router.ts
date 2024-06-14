import { createRouter, createWebHistory } from "vue-router";
import index from "../pages/index.vue";
import Roles from "../pages/admin/roles/index.vue";
import CustomTableExemple from "../pages/admin/components/tableExemple.vue";

const routes = [
  { path: "/", component: index },
  { path: "/admin/roles", component: Roles },
  { path: "/components/table", component: CustomTableExemple },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
