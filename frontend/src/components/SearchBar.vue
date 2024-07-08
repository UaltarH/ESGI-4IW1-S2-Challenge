<template>
<div class="search p-4 relative" ref="searchContainer">
    <div class="flex">
    <input
        v-model="searchTerm"
        @keyup.enter="performSearch"
        placeholder="Rechercher un produit..."
        class="border border-gray-300 rounded-l px-4 py-2 ring-1 ring-gray-300"
    />
    <button
        @click="performSearch"
        class="bg-primary text-white rounded-r px-4 py-2 hover:bg-primary-light ring-1 ring-gray-300"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
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
import {useSearchBarManagement} from "@/composables/useSearchBarManagement.ts";
import { ref, watchEffect } from "vue";

const {getSearch} = useSearchBarManagement();

interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

let searchTerm = '';
const products = ref<Product[]>([]);
const open = ref(false);
const searchContainer = ref<HTMLElement | null>(null);

const navigateToArticle = (id :number) => {
  window.location.href = `/article/${id}`;
};

function performSearch() {
    getSearch(searchTerm)
    .then(response => {
        products.value = response.message as Product[];
        open.value = true;
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
    });
};

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
