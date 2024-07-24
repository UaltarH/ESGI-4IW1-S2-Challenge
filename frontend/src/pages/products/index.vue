<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-center">Produits</h1>

    <!-- Filters Section -->
    <div class="mb-6 flex flex-col lg:flex-row justify-between">
      <div class="flex flex-col items-center lg:block">
        <h2 class="text-xl font-bold mb-2">Filtrer par categorie</h2>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="category in categories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            :class="{'bg-primary text-white': selectedCategories.includes(category.id), 'bg-gray-200': !selectedCategories.includes(category.id)}"
            class="px-4 py-2 rounded-lg"
          >
            {{ category.name }}
          </Button>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <h2 class="text-xl font-bold mb-4">Filtrer le maximum du prix</h2>        
        <Slider
          v-model="maxPriceFilter.value"
          :default-value="[maxPrice]"
          :max="maxPrice"
          :min="minPrice"
          :step="1"
          @update:modelValue="onSliderChange"
        />
        <span>{{  maxPriceFilter.value[0].toFixed(2) }}€</span>
      </div>      
    </div>

    <!-- Products Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="product in products">
        <RouterLink :to="`/product/${product._id}`" :aria-label="product.name">
          <ProductCard              
            :image="getImageUrl(product)"
            :name="product.name"
            :description="product.description"
            :price="product.price"
            :inStock="product.stock > 0"
          />
        </RouterLink>
      </div>
    </div>

    <Pagination v-slot="{ page }" v-model:page="currentPage" :total="maxProducts" :sibling-count="1" show-edges :default-page="1" class="flex justify-center mt-4">
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst @click="goToPage(1)" />
        <PaginationPrev @click="goToPage(page - 1)" />

        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
            <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'" @click="goToPage(item.value)">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext @click="goToPage(page + 1)" />
        <PaginationLast @click="goToPage(Math.ceil(maxProducts / maxProductsPerPage))" />
      </PaginationList>
    </Pagination>

  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import ProductCard from '@/components/common/products/CardProduct.vue';
import { Slider } from '@/components/ui/slider';
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import { ProductService } from '@/composables/api/products.service.ts'; 
import { CategoriesService } from "@/composables/api/categories.service.ts";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import {
  Button,
} from '@/components/ui/button'
import { Category } from '@/dto/category.dto';
import { debounce } from 'lodash-es';


const products = ref<mongoProduct[]>([]);
const categories = ref<Category[]>([]);
const selectedCategories = ref<string[]>([]);
const maxPrice = ref(0);
const minPrice = ref(0);
const maxPriceFilter = reactive({ value: [0] });
const maxProductsPerPage = 9;
const maxProducts = ref(0);
const currentPage = ref(1);


onMounted(() => {
  fetchProducts();
  fetchCategories();
});



const fetchProducts = async () => {
  try {    
    let maxPriceFilterValue = maxPriceFilter.value[0] === 0 ? undefined : maxPriceFilter.value[0];
    const response = await ProductService().getAllMongoProducts({
      categories: selectedCategories.value,
      maxPrice: maxPriceFilterValue,
      page: currentPage.value,
      limit: maxProductsPerPage
    });
    
    products.value = response.products;
    maxPrice.value = response.maxPrice;
    minPrice.value = response.minPrice;
    maxProducts.value = response.totalCount;
    if(maxPriceFilter.value[0] === 0){
      maxPriceFilter.value = [response.maxPrice];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchCategories = async () => {
  try {
    CategoriesService().getCategories().then(res => {
      categories.value = res.categories;
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchProducts();
};


const toggleCategory = (categoryId: string) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index === -1) {
    selectedCategories.value.push(categoryId);
  } else {
    selectedCategories.value.splice(index, 1);
  }
  currentPage.value = 1;
  fetchProducts();
};

const debouncedFetchProducts = debounce(() => {
  fetchProducts();
}, 500);

const onSliderChange = () => {  
  currentPage.value = 1; 
  debouncedFetchProducts();
};

const getImageUrl = (product: any) => {
  const images = [
    '/products/exemple/cartonExemple.png',
    '/products/exemple/cat.png',
    '/products/exemple/snake.png',
  ];
  return images[Math.floor(Math.random() * images.length)];
};


</script>
