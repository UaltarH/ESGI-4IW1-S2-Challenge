<template>
<div class="search p-4 relative" ref="searchContainer">
    <div class="flex">
    <input
        v-model="searchTerm"
        @keyup.enter="performSearch"
        placeholder="Rechercher un produit..."
        class="border border-gray-300 rounded-l px-4 py-2 w-200 ring-1 ring-gray-300"
    />
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
import {useSearchBarManagement} from "@/composables/useSearchBarManagement.ts";
import { ref, watchEffect } from "vue";

const {getSearch} = useSearchBarManagement();

interface Product {
    id: string,
    name: string;
    description: string;
    price: number;
    stock: number;
    CategoryId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: any,
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
        console.log(response);
        products.value = response.products as Product[];
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
