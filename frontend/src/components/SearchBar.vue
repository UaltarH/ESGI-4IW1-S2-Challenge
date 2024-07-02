<template>
    <div class="search p-4 relative" ref="searchContainer">
      <div class="flex relative">
        <div class="relative w-200">
          <input
            v-model="searchTerm"
            @keyup.enter="performSearch"
            placeholder="Rechercher un produit..."
            class="border border-gray-300 rounded-l px-4 py-2 ring-1 ring-gray-300 pr-10"
          />
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Clear search"
          >
            &times; 
          </button>
        </div>
        <button
          @click="performSearch"
          class="bg-primary text-white rounded-r px-4 py-2 hover:bg-primary-light ring-1 ring-gray-300"
        >
          Rechercher
        </button>
      </div>
  
      <div
        v-if="open"
        class="mt-4 absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-300 rounded-lg z-10 p-4 max-h-96 overflow-y-auto"
      >
        <h3 class="text-lg font-semibold mb-2">Résultats:</h3>
        <ul class="space-y-4">
          <li
            v-if="products.length > 0"
            v-for="product in products"
            :key="product.productId"
            class="p-4 border border-gray-300 rounded-lg cursor-pointer"
            @click="navigateToArticle(product.productId)"
          >
            <h4 class="text-xl font-bold">{{ product.name }}</h4>
            <p class="text-gray-900">{{ product.price }} €</p>
          </li>
          <li v-else class="p-4 border border-gray-300 rounded-lg">
            <h4 class="text-xl font-bold">Pas de résultats trouvés</h4>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useSearchBarManagement } from "@/composables/useSearchBarManagement.ts";
  import { ref, onMounted, watchEffect } from "vue";
  import { useRouter, useRoute } from "vue-router";
  
  const { getSearch } = useSearchBarManagement();
  const router = useRouter();
  const route = useRoute();
  
  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    CategoryId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: any;
  }
  
  const searchTerm = ref<string>('');
  const products = ref<Product[]>([]);
  const open = ref(false);
  const searchContainer = ref<HTMLElement | null>(null);
  
  const navigateToArticle = (id: number) => {
    window.location.href = `/article/${id}`;
  };
  
  const performSearch = () => {
    getSearch(searchTerm.value)
      .then(response => {
        console.log(response);
        products.value = response.products as Product[];
        open.value = true;
        // Update URL with search term
        router.push({ query: { search: searchTerm.value } });
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  };
  
  const clearSearch = () => {
    searchTerm.value = '';
    products.value = [];
    open.value = false;
    router.push({ query: {} });
  };
  
  onMounted(() => {
    setTimeout(() => {
      const query = route.query.search as string | undefined;
      console.log('Route query:', route.query);
      console.log('Search query:', query);
  
      if (query) {
        searchTerm.value = query;
        performSearch();
      }
    }, 100);
  });
  
  watchEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
        open.value = false;
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  </script>
  
  <style scoped>
  .relative {
    position: relative;
  }
  button {
    transition: background-color 0.3s;
  }
  button:focus {
    outline: none;
  }
  button:hover {
    cursor: pointer;
  }
  </style>
  