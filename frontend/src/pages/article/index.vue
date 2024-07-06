<template>
  <div class="container mx-auto py-16">
    <div class="flex flex-col md:flex-row items-center">      
      <div class="w-full md:w-1/2 p-4 mr-8">
        <CarouselImages :images="imageUrls" />
      </div>
      <div class="w-full md:w-1/2 p-4">
        <h2 class="text-3xl font-bold mb-4">{{ article.name }}</h2>
        <p class="text-xl font-semibold mb-4">{{ article.price }} €</p>
        <p class="text-gray-700 mb-6">{{ article.description }}</p>
        <div class="flex items-center">
          <label for="quantity" class="mr-3">Quantité</label>
          <select id="quantity" class="border rounded p-2">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="addToCart" class="ml-6 bg-black text-white py-2 px-4 rounded-lg shadow-md">Ajouter au panier</button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProductService } from '@/composables/api/products.service.ts';
import { mongoArticle } from '@/dto/MongoArticle.dto.ts';
import CarouselImages from './CarouselImages.vue';

const article: Ref<mongoArticle> = ref({} as mongoArticle);
const route = useRoute();

const fetchArticle = async () => {
  try {
    let productId = route.params.id as unknown as number;
    const response = await ProductService().getSpecificMongoProduct(productId);
    article.value = response.product;
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

onMounted(async () => {
  await fetchArticle();
});

const imageUrls = [
  'https://placehold.co/150',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400'
];

const addToCart = () => {
  console.log(`Adding ${article.value.name} to cart`);
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
