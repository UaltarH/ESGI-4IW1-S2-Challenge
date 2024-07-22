<template>
  <div class="flex justify-center items-center">
    <button type="button" @click="toggleSearchBar" class="menu-link px-2.5 py-2.5 flex justify-center items-center">
      <svg v-if="!isToggled" width="24" height="24" class="stroke-dark-blue" :class="props.darkMode ? 'dark:stroke-white' : ''" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-else class="w-6 h-6 block font-medium text-center !px-0 text-2xl leading-6">&times;</span>
    </button>
  </div>
  <Transition name="slide-fade">
    <div v-if="isToggled" class="search" ref="searchContainer">
      <button type="button" class="search-close" @click="toggleSearchBar">&times;</button>
      <div class="search-bar">
        <div class="relative w-full">
          <input v-if="isToggled"
                 v-model="searchTerm" @focus="open=true" @keyup.enter="performSearch"
                 placeholder="Rechercher un produit..."
                 class="search-input"
                 aria-label="Chercher un produit"
          />
          <button v-if="searchTerm" @click="clearSearch"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Clear search">
            &times;
          </button>
        </div>
        <button @click="performSearch" class="search-button" aria-label="Chercher">
          <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <!-- Search content -->
      <div v-if="open" class="search-content">
        <div class="search-filters">
          <div>
            <button
                @click="handleStock()"
                :class="stock ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
                class="px-2 py-1 mt-1 text-white text-sm font-medium rounded"
                aria-label="Filtre les produits en stock"
            >
              En stock
            </button>
          </div>
          <div v-for="category in categories" :key="category.id">
            <button
                @click="selectCategory(category.name)"
                :class="categoryName === category.name ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
                class="px-2 py-1 mt-1 text-white text-sm font-medium rounded"
                :aria-label="`Filtrer par la catégorie ${category.name}`"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        <h2 class="text-2xl font-semibold mb-2 mt-8 text-left">Résultats:</h2>
        <ul class="search-results">
          <li
              v-if="products.length > 0"
              v-for="product in products"
              :key="product._id"
          >
            <div
                :class="product.stock <= 0 ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-white dark:bg-dark-blue'"
                class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-950"
                @click="navigateToProduct(product._id)"
            >
              <h4 class="text-xl font-bold">{{ product.name }}</h4>
              <p>{{ formatPrice(product.price) }} €</p>
              <p v-if="product.stock <= 0">Plus de stock</p>
            </div>
          </li>
          <li v-else class="p-4 border border-gray-300 rounded-lg">
            <h4 class="text-xl font-bold">Pas de résultats trouvés</h4>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>



<script setup lang="ts">
  import { useSearchBarManagement } from "@/composables/api/useSearchBarManagement.ts";
  import { CategoriesService } from "@/composables/api/categories.service.ts";
  import { ref, onMounted, watchEffect } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { mongoProduct } from "@/dto/MongoProduct.dto";
  
  const { getSearch } = useSearchBarManagement();
  const { getCategories } = CategoriesService();
  const router = useRouter();
  const route = useRoute();

  
  interface Category {
    id: string;
    name: string;
    createdAt: Date;
    deletedAt: any;
  }

  const props = defineProps({
    darkMode: {
      type: Boolean,
      default: false
    }
  });
  
  const searchTerm = ref<string>('');
  const categoryName = ref<string>('');
  const stock = ref<boolean>(false);
  const products = ref<mongoProduct[]>([]);
  const categories = ref<Category[]>([]);
  const open = ref(false);
  const searchContainer = ref<HTMLElement | null>(null);
  const isToggled = ref(false);
  
  const navigateToProduct = (id: string) => {
    router.push(`/product/${id}`).then(() => {
      isToggled.value = false;
      open.value = false;
    });
  };

  const formatPrice = (price: any) => {
      return price.toFixed(2);
  }
  
  const performSearch = () => {
    getSearch(searchTerm.value, categoryName.value, stock.value)
      .then(response => {
        products.value = response.products as mongoProduct[];
        if(searchTerm.value || categoryName.value || stock.value) {
          router.push({ query: { search: searchTerm.value, category: categoryName.value, stock: encodeURIComponent(stock.value) } });
        }
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

      if(searchTerm.value || categoryName.value || stock.value) {
        router.push({ query: { search: searchTerm.value, category: categoryName.value, stock: encodeURIComponent(stock.value) } });
      }
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
function toggleSearchBar() {
  isToggled.value = !isToggled.value;
}
</script>

<style scoped>
button {
  transition: background-color 0.3s;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>