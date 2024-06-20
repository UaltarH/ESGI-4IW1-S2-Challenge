<template>
  <div class="py-16">
    <h2 class="text-3xl font-bold mb-4">{{ article.name }}</h2>
  </div>
  <div class="mt-2 bg-gray-100 p-6 rounded-lg shadow-md">
    <p class="text-xl mb-2">{{ article.price }} €</p>
    <p class="text-gray-700">{{ article.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchBarManagement } from '@/composables/useSearchBarManagement.ts'; 

const { getProductById } = useSearchBarManagement();

interface Article {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const article = ref<Article>({
  productId: 0,
  name: '',
  description: '',
  price: 0,
  stock: 0
});

const route = useRoute();

onMounted(async () => {
  const productId = Number(route.params.id); 
  try {
    getProductById(productId)
      .then(res => {
        article.value = res.product;
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
});
</script>
