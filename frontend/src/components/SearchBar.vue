<template>
  <div class="flex justify-center items-center">
    <button type="button" @click="toggleSearchBar" class="menu-link px-2.5 py-2.5 flex justify-center items-center">
      <svg v-if="!isToggled" width="24" height="24" class="stroke-dark-blue" :class="props.darkMode ? 'dark:stroke-white' : ''" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-else class="w-6 h-6 block font-medium text-center !px-0 text-2xl leading-6">&times;</span>
    </button>

    <Transition name="slide-fade">
      <div v-if="isToggled" class="search relative" ref="searchContainer">
        <div class="flex relative">
          <div class="relative" >
            <input v-if="isToggled"
                   v-model="searchTerm" @click="open = true" @keyup.enter="performSearch"
                   placeholder="Rechercher un produit..."
                   class="border border-gray-300 rounded-l px-4 py-2 ring-1 ring-gray-300 pr-10"
            />
            <button v-if="searchTerm" @click="clearSearch"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Clear search">
              &times;
            </button>
          </div>
          <button @click="performSearch"
                  class="bg-primary text-white rounded-r px-4 py-2 hover:bg-primary-light ring-1 ring-gray-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#1f2345" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div
            v-if="open"
            class="mt-4 absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-300 rounded-lg z-10 p-4 max-h-96 overflow-y-auto"
        >
          <div class="flex flex-wrap justify-around">
            <div>
              <button
                  @click="handleStock()"
                  :class="stock ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
                  class="px-2 py-1 mt-1 text-white text-sm font-medium rounded"
              >
                En stock
              </button>
            </div>
            <div v-for="category in categories" :key="category.id">
              <button
                  @click="selectCategory(category.name)"
                  :class="categoryName === category.name ? 'bg-primary hover:bg-primary-light' : 'bg-gray-500 hover:bg-gray-400'"
                  class="px-2 py-1 mt-1 text-white text-sm font-medium rounded"
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
                :key="product._id"
                :class="product.stock <= 0 ? 'bg-gray-200 text-gray-500' : 'bg-white'"
                class="p-4 border border-gray-300 rounded-lg cursor-pointer"
                @click="navigateToProduct(product._id)"
            >
              <h4 class="text-xl font-bold">{{ product.name }}</h4>
              <p>{{ formatPrice(product.price) }} €</p>
              <p v-if="product.stock <= 0">Plus de stock</p>
            </li>
            <li v-else class="p-4 border border-gray-300 rounded-lg">
              <h4 class="text-xl font-bold">Pas de résultats trouvés</h4>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
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
    window.location.href = `/product/${id}`;
  };

  const formatPrice = (price: any) => {
      return price.toFixed(2);
  }
  
  const performSearch = () => {
    getSearch(searchTerm.value, categoryName.value, stock.value)
      .then(response => {
        products.value = response.products as mongoProduct[];
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