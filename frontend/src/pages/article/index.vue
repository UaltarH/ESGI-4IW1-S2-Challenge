<template>
  <div class="container mx-auto py-16">
    <div class="flex flex-col md:flex-row items-center">      
      <div class="w-full md:w-1/2 p-4 mr-8">
        <CarouselImages :images="imageUrls" />
      </div>
      <div class="w-full md:w-1/2 p-4">
        <h2 class="text-3xl font-bold mb-4">{{ product.name }}</h2>
        <p class="text-xl font-semibold mb-4">{{ product.price }} €</p>
        <p class="text-gray-700 mb-6">{{ product.description }}</p>
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

  <Separator/>

  <div class="flex flex-col items-center py-8">
    <h3 class="text-2xl font-bold mb-4">Derniers produits ajoutés</h3>
    <LastProductsCarousel :contents="lastProducts" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ProductService } from '@/composables/api/products.service.ts';
import { mongoArticle } from '@/dto/MongoArticle.dto.ts';
import CarouselImages from './CarouselImages.vue';
import LastProductsCarousel  from '@/components/common/products/LastProductsCarousel.vue';
import { Separator } from '@/components/ui/separator';

const product: Ref<mongoArticle> = ref({} as mongoArticle);
const lastProducts: Ref<mongoArticle[]> = ref([]);
const route = useRoute();

onMounted(async () => {
  await fetchProduct();
  await fetchLastProducts();
});

watch(() => route.params.id, async () => {
  await fetchProduct();
});
const fetchProduct = async () => {
  try {
    let productId = route.params.id as unknown as number;
    const response = await ProductService().getSpecificMongoProduct(productId);
    product.value = response.product;    
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

const fetchLastProducts = async () => {
  try {
    const response = await ProductService().getLastMongoProduct();
    lastProducts.value = response.products;
  } catch (error) {
    console.error('Error fetching last products:', error);
  }
};

const imageUrls = [
  'https://placehold.co/150',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400'
];

const addToCart = () => {
  console.log(`Adding ${product.value.name} to cart`);
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
