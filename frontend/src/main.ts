import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import { router } from "./router/router.ts";
import {createPinia} from "pinia";

let app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
