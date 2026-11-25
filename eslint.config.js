import js from "@eslint/js";
import globals from "globals";
import vue from "eslint-plugin-vue";

export default [
  { ignores: ["src/vendor/**"] },
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        REST_ENDPOINT: "readonly",
        REQUEST_CACHE_MAX: "readonly",
        POSTS_PER_PAGE: "readonly",
        GA_TRACKING_ID: "readonly"
      }
    },
    rules: { "vue/multi-word-component-names": "off" }
  }
];
