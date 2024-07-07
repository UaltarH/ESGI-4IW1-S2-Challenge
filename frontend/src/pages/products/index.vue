<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-center">Produits</h1>

    <!-- Filters Section -->
    <div class="mb-6 flex flex-col lg:flex-row justify-between">
      <div class="flex flex-col items-center lg:block">
        <h2 class="text-xl font-bold mb-2">Filtrer par categorie</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            :class="{'bg-primary text-white': selectedCategories.includes(category.id), 'bg-gray-200': !selectedCategories.includes(category.id)}"
            class="px-4 py-2 rounded-lg"
          >
            {{ category.name }}
          </button>
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
        />
        <span>{{ maxPriceFilter.value[0].toFixed(2) }}€</span>
      </div>      
    </div>

    <!-- Products Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="product in filteredProducts">
        <RouterLink :to="`/product/${product._id}`">
          <ProductCard              
            :image="getImageUrl(product)"
            :name="product.name"
            :description="product.description"
            :price="product.price"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, Ref, computed, reactive } from 'vue';
import ProductCard from '@/components/common/products/CardProduct.vue';
import { Slider } from '@/components/ui/slider';
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import { ProductService } from '@/composables/api/products.service.ts'; 

interface Category {
  id: string;
  name: string;
}

const products:Ref<mongoProduct[]> = ref([]);
const categories:Ref<Category[]> = ref([]);
const selectedCategories = ref<string[]>([]);

const maxPrice = ref(0);
const minPrice = ref(0);
const maxPriceFilter = reactive({ value: [0] });

onMounted(() => {
  fetchProducts();
});

const fetchProducts = async () => {
  try {    
    ProductService().getAllMongoProducts().then(res => {
      products.value = res.products;
      setVariables();
    });    
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const setVariables = () => {
  let min = products.value[0].price;
  let max = products.value[0].price; 
  products.value.forEach((product: mongoProduct) => {
    if (!categories.value.find(category => category.id === product.categoryId)) {
      categories.value.push({ id: product.categoryId, name: product.categoryName });
    }
    if (product.price < min) {
      min = product.price;
    }
    if (product.price > max) {
      max = product.price;
    }
  });  

  minPrice.value = min;
  maxPrice.value = max;
  maxPriceFilter.value = [max];
};

const filteredProducts = computed(() => {
  if (selectedCategories.value.length === 0 && maxPriceFilter.value[0] === maxPrice.value) {
    return products.value;
  }
  return products.value.filter((product: mongoProduct) => {
    const categoryFilter = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.categoryId);
    const priceFilter = product.price <= maxPriceFilter.value[0];
    return categoryFilter && priceFilter;
  });
});

const toggleCategory = (categoryId: string) => {
  if (selectedCategories.value.includes(categoryId)) {
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

const getImageUrl = (product: any) => {
  return 'https://via.placeholder.com/150';
};

</script>
