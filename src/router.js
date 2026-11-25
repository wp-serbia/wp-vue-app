import { createRouter, createWebHistory } from "vue-router";
import Feed from "./views/Feed.vue";
import FourOFour from "./views/FourOFour.vue";
import Post from "./views/Post.vue";
import bus from "./bus";

const routes = [
  {
    name: "home",
    path: "/",
    redirect: "/posts"
  },
  {
    name: "posts",
    path: "/posts",
    component: Feed
  },
  {
    name: "post",
    path: "/posts/:slug",
    component: Post
  },
  {
    name: "page",
    path: "/page/:page",
    component: Feed
  },
  {
    name: "four-o-four",
    path: "/404",
    component: FourOFour
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to, from, failure) => {
  if (failure) return;
  //-- Bump the key on App component to force component to update on route change.
  bus.emit("bumpViewKey");
});

export default router;
