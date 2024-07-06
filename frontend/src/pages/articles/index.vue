<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Produits</h1>

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
        <span>{{ maxPriceFilter.value[0] }}€</span>
      </div>      
    </div>

    <!-- Articles Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="article in filteredArticles">
        <RouterLink :to="`/article/${article._id}`">
          <ArticleCard          
            :key="article._id"
            :image="getImageUrl(article)"
            :name="article.name"
            :description="article.description"
            :price="article.price"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, Ref, computed, reactive } from 'vue';
import ArticleCard from './CardArticle.vue';
import { Slider } from '@/components/ui/slider';
import { mongoArticle } from '@/dto/MongoArticle.dto.ts';
import { ProductService } from '@/composables/api/products.service.ts'; 

interface Category {
  id: string;
  name: string;
}

const articles:Ref<mongoArticle[]> = ref([]);
const categories:Ref<Category[]> = ref([]);
const selectedCategories = ref<string[]>([]);

const maxPrice = ref(0);
const minPrice = ref(0);
const maxPriceFilter = reactive({ value: [0] });

onMounted(() => {
  fetchArticles();
});

const fetchArticles = async () => {
  try {    
    ProductService().getAllMongoProducts().then(res => {
      articles.value = res.products;
      setVariables();
    });    
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

const setVariables = () => {
  let min = articles.value[0].price;
  let max = articles.value[0].price; 
  articles.value.forEach((article: mongoArticle) => {
    if (!categories.value.find(category => category.id === article.categoryId)) {
      categories.value.push({ id: article.categoryId, name: article.categoryName });
    }
    if (article.price < min) {
      min = article.price;
    }
    if (article.price > max) {
      max = article.price;
    }
  });  

  minPrice.value = min;
  maxPrice.value = max;
  maxPriceFilter.value = [max];
};

const filteredArticles = computed(() => {
  if (selectedCategories.value.length === 0 && maxPriceFilter.value[0] === maxPrice.value) {
    return articles.value;
  }
  return articles.value.filter((article: mongoArticle) => {
    const categoryFilter = selectedCategories.value.length === 0 || selectedCategories.value.includes(article.categoryId);
    const priceFilter = article.price <= maxPriceFilter.value[0];
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

const getImageUrl = (article: any) => {
  return 'https://via.placeholder.com/150';
};

</script>
