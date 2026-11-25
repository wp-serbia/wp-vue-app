import { createStore } from "vuex";
import cache from "./modules/cache";
import bus from "../bus";

export default createStore({
  state: {
    endpoint: REST_ENDPOINT
  },

  mutations: {
    updateEndpoint(state, endpoint) {
      state.endpoint = endpoint;
      bus.emit("clearError");
      bus.emit("bumpViewKey", "Updating content...");
    }
  },

  modules: {
    cache
  }
});
