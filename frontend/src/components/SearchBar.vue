<template>
  <div class="search pr-4 relative" ref="searchContainer">
    <div class="flex relative flex-col lg:flex-row">
      <div class="relative w-200">
        <input
          v-model="searchTerm"
          @click="open = true"
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
      <div class="flex flex-nowrap justify-around">
        <div>
          <button 
            @click="handleStock()"
            :class="stock ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
            class="px-2 py-1 text-white text-sm font-medium rounded"
          >
            En stock
          </button>
        </div>
        <div v-for="category in categories" :key="category.id">
          <button 
            @click="selectCategory(category.name)"
            :class="categoryName === category.name ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
            class="px-2 py-1 text-white text-sm font-medium rounded"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-2">Résultats:</h3>
      <ul class="space-y-4">
        <li
          v-if="products.length > 0"
          v-for="product in products"
          :key="product.productId"
          :class="product.stock <= 0 ? 'bg-gray-200 text-gray-500' : 'bg-white'"
          class="p-4 border border-gray-300 rounded-lg cursor-pointer"
          @click="navigateToProduct(product.productId)"
        >
          <h4 class="text-xl font-bold">{{ product.name }}</h4>
          <p>{{ product.price }} €</p>
          <p v-if="product.stock <= 0">Plus de stock</p>
        </li>
        <li v-else class="p-4 border border-gray-300 rounded-lg">
          <h4 class="text-xl font-bold">Pas de résultats trouvés</h4>
        </li>
      </ul>
    </div>
  </div>
</template>


  
<script setup lang="ts">
  import { useSearchBarManagement } from "@/composables/api/useSearchBarManagement.ts";
  import { useCategoryManagement } from "@/composables/api/useCategoryManagement.ts";
  import { ref, onMounted, watchEffect } from "vue";
  import { useRouter, useRoute } from "vue-router";
  
  const { getSearch } = useSearchBarManagement();
  const { getCategories } = useCategoryManagement();
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
  
  interface Category {
    id: string;
    name: string;
    createdAt: Date;
    deletedAt: any;
  }
  
  const searchTerm = ref<string>('');
  const categoryName = ref<string>('');
  const stock = ref<boolean>(false);
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const open = ref(false);
  const searchContainer = ref<HTMLElement | null>(null);
  
  const navigateToProduct = (id: number) => {
    window.location.href = `/product/${id}`;
  };
  
  const performSearch = () => {
    getSearch(searchTerm.value, categoryName.value, stock.value)
      .then(response => {
        products.value = response.products as Product[];
        router.push({ query: { search: searchTerm.value, category: categoryName.value, stock: encodeURIComponent(stock.value) } });
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  };

  const handleStock = () => {
    stock.value = !stock.value;
    performSearch();
  }

  const selectCategory = (name: string) => {
    if (categoryName.value === name) {
      categoryName.value = '';
    } else {
      categoryName.value = name;
    }
    performSearch();
  }

  const getAllCategories = () => {
    getCategories()
      .then(res => {
        categories.value = res.categories
        
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  }
  
  const clearSearch = () => {
    searchTerm.value = '';
    categoryName.value = '';
    stock.value = false;
    open.value = false;
    router.push({ query: { search: searchTerm.value, category: categoryName.value, stock: encodeURIComponent(stock.value) } });
    performSearch();
  };
  
  onMounted(() => {
    getAllCategories();
    setTimeout(() => {
      const search = route.query.search as string || '';
      const category = route.query.category as string || '';
      const stockQuery = route.query.stock; 
      let stockValue: boolean = false;
      if (Array.isArray(stockQuery) && stockQuery.length > 0) {
        stockValue = stockQuery.includes('true') || stockQuery.includes('1');
      } else if (typeof stockQuery === 'string') {
        stockValue = stockQuery === 'true' || stockQuery === '1';
      }  
      searchTerm.value = search;
      categoryName.value = category;
      stock.value = stockValue;

      router.push({ query: { search: searchTerm.value, category: categoryName.value, stock: encodeURIComponent(stock.value) } });
      performSearch();
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
  