import { createMemoryHistory, createRouter } from 'vue-router'
import index from "../pages/index.vue";

const routes = [
    { path: '/', component: index },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})