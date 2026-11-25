import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    define: {
      REST_ENDPOINT: JSON.stringify(env.REST_ENDPOINT || "/wp-json/wp/v2"),
      POSTS_PER_PAGE: JSON.stringify(env.POSTS_PER_PAGE || 9),
      REQUEST_CACHE_MAX: JSON.stringify(env.REQUEST_CACHE_MAX || 150),
      GA_TRACKING_ID: JSON.stringify(env.GA_TRACKING_ID || "")
    }
  };
});
