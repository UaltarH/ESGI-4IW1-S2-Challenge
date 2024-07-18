<template>
  <div class="container mx-auto py-16">
    <div class="flex flex-col md:flex-row items-center">
      <div class="w-full md:w-1/2 p-4 mr-8">
        <CarouselImages :images="imageUrls" />
      </div>
      <div class="w-full md:w-1/2 p-4">
        <h2 class="text-3xl font-bold mb-4">{{ product.name }}</h2>
        <p v-if="!isProductAvailable" class="text-red-600 mb-4">Produit indisponible</p>
        <p class="text-xl font-semibold mb-4">{{ product.price }} €</p>
        <p class="text-gray-700 mb-6">{{ product.description }}</p>
        <div class="flex items-center gap-4">
          <label for="quantity">Quantité</label>
          <select id="quantity" class="border rounded p-2 dark:bg-dark-blue dark:border-gray-700" :class="!isProductAvailable ? 'bg-gray-200 dark:bg-dark-blue-dark cursor-not-allowed' : ''" v-model="qty" :disabled="!isProductAvailable">
            <option v-for="n in product.stock < 0 ? 0 : product.stock" :key="n" :value="n">{{ n }}</option>
          </select>
          <button v-if="isProductAvailable" @click="addToCart" class="btn btn--primary py-2 px-4" :disabled="!isProductAvailable">Ajouter au panier</button>
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
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import CarouselImages from './CarouselImages.vue';
import LastProductsCarousel  from '@/components/common/products/LastProductsCarousel.vue';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from "@/stores/cart.ts";
import {useNotificationStore} from "@/stores/notification.ts";

const route = useRoute();
const cart = useCartStore();
const notificationStore = useNotificationStore();

const product: Ref<mongoProduct> = ref({} as mongoProduct);
const lastProducts: Ref<mongoProduct[]> = ref([]);
const isProductAvailable = ref(false);

const qty = ref(1);

onMounted(async () => {
  await fetchProduct();
  await fetchLastProducts();
});

watch(() => route.params.id, async () => {
  await fetchProduct();
});

const imageUrls = [
  'https://placehold.co/150',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400',
  'https://placehold.co/600x400'
];

const fetchProduct = async () => {
  try {
    let productId = route.params.id as unknown as string;
    const response = await ProductService().getSpecificMongoProduct(productId);
    product.value = response.product;
    product.value.price = parseFloat(product.value.price.toFixed(2));
    isProductAvailable.value = product.value.stock > 0;
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

const addToCart = () => {
  console.log(`Adding ${product.value.name} to cart`);
  console.log(`Quantity: ${qty.value}`);
  // TODO : manage size but need to be added in the product mongo model first
  cart.addToCart({
    id: product.value._id,
    postgresId: product.value.postgresId,
    name: product.value.name,
    price: product.value.price,
    quantity: qty.value,
    size: 'M',
    description: product.value.description
  }).then(async () => {
    console.log('Item added to cart');
    await fetchProduct();
    notificationStore.add({message: 'Produit ajouté au panier', timeout: 3000, type: 'success'});
  }).catch((error) => {
    console.error('Error adding item to cart:', error);
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
