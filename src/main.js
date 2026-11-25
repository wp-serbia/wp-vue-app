import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import utils from "./mixins/utils";
import store from "./store";
import { setupAnalytics } from "./analytics";

setupAnalytics(router);
createApp(App).use(store).use(router).mixin(utils).mount("#app");
