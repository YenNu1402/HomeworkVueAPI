import { createRouter, createWebHistory } from "vue-router";
import PokemonList from "@/component/PokemonList.vue";
import PokemonDetail from "@/component/PokemonDetail.vue";

const routes = [
  { path: "/", component: PokemonList },
  { path: "/pokemon/:id", component: PokemonDetail, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;