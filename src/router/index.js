import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import SearchResults from "../components/SearchResults.vue";

const routes = [
  { path: "/", name: "home-page", component: HomePage },
  { path: "/search", name: "search", component: SearchResults },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
