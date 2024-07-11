import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import { router } from "./router/router.ts";
import {createPinia} from "pinia";

let app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
