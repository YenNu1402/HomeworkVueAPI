<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const isLoading = ref(true);
const allPokemonList = ref([]);
const visibleCount = ref(16);
const router = useRouter();
const offset = ref(0);
const limit = 1000;
const error = ref(null);

const fetchPokemon = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Không thể tải danh sách Pokémon!");
    const data = await res.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (p) => {
        const detailsRes = await fetch(p.url);
        const details = await detailsRes.json();
        return {
          id: details.id,
          name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          image: details.sprites.front_default || "https://via.placeholder.com/96",
          types: details.types?.map((t) => t.type.name) || [], // 🛠 Kiểm tra null
        };
      })
    );

    allPokemonList.value = [...allPokemonList.value, ...pokemonDetails];
    offset.value += limit;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (visibleCount.value < allPokemonList.value.length) {
    visibleCount.value += 20;
  }
};

const filteredPokemon = computed(() => {
  return allPokemonList.value
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .slice(0, visibleCount.value);
});

const goToDetail = (id) => {
  router.push(`/pokemon/${id}`);
};

onMounted(fetchPokemon);
</script>



<template>
  <div class="container">
    <h1 id="poke" style="color: rgb(0, 20, 0)">PokemonAPI</h1>
    <div class="search-bar" >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm Pokémon..."
      />
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else class="pokemon-list">
      <router-link
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :to="`/pokemon/${pokemon.id}`"
        class="pokemon-card"
      >
        <p>#{{ pokemon.id }}</p>
        <img :src="pokemon.image" :alt="pokemon.name" />
        <h2>{{ pokemon.name }}</h2>
        <div class="types">
          <span
            v-for="type in pokemon.types"
            :key="type"
            :class="['type', type.toLowerCase()]"
          >
            {{ type }}
          </span>
        </div>
      </router-link>
    </div>

    <div
      v-if="visibleCount < allPokemonList.length"
      class="load-more-container"
    >
      <button @click="loadMore" class="load-more-btn">Load More</button>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f8f9fd;
  display: flex;
  flex: wrap;
  align-items: center;
  min-height: 80vh;
  justify-content: center;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 20px auto;
  max-width: 100%;
}

h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 2rem;
  color: #333;
  margin-right: 900px;
  margin-left: 900px;
}

.search-bar input {
  display: block;
  width: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 1rem;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  box-shadow: 1px 2px 5px rgba(72, 22, 224, 0.1);
  transition: border-color 0.3s ease;
}
.search-bar input:focus {
  border-color: black;
}

.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.pokemon-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(2, 1, 1, 0.1);
  padding: 12px;
  width: 280px;
  text-align: center;
  transition: transform 0.3s ease, border 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
}
.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.pokemon-card img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin: 10px 0;
}
.pokemon-card h2 {
  font-size: 1.2rem;
  color: #333;
}

.pokemon-card p {
  font-size: 0.9rem;
  color: #666;
}

.types {
  margin-top: 10px;
}

.type {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 5px;
  color: white;
  font-size: 0.8rem;
  margin: 2px;
}

.type.fire {
  background-color: #f08030;
}

.type.water {
  background-color: #3399FF;
}

.type.grass {
  background-color: #78c850;
}

.type.electric {
  background-color: #ffd700;
}
.type.ice {
  background-color: #66d3fa;
}
.type.fighting {
  background-color: #c22e28;
}
.type.poison {
  background-color: #a040a0;
}
.type.ground {
  background-color: #e2bf65;
}
.type.flying {
  background-color: #a890f0;
}
.type.psychic {
  background-color: #f95587;
}
.type.bug {
  background-color: #A6B91A;
}
.type.rock {
  background-color: #B6A136;
}
.type.ghost {
  background-color: #735797;
}
.type.dragon {
  background-color: #6F35FC;
}
.type.dark {
  background-color: #705746;
}
.type.steel {
  background-color: #B7B7CE;
}
.type.fairy {
  background-color: #D685AD;
}
.type.normal {
  background-color: #A8A77A;
}
.load-more-container {
  margin-top: 20px;
  text-align: center;
}

.load-more-btn {
  display: flex;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #733cc7, #5171e4);
  text-align: center;
  justify-content: center;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  outline: none;
}

.load-more-btn:hover {
  background: linear-gradient(45deg, #834bd6, #788fe4);
  transform: scale(1.05);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}

.load-more-btn:active {
  transform: scale(0.95);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #16557f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>