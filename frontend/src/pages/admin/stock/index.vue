<template>
  <div class="p-6 min-h-screen transition duration-200 ease-in-out">
    <h1 class="text-3xl font-bold mb-6 text-center dark:text-white">Gestion des stocks</h1>
    <div class="max-w-4xl mx-auto bg-secondary-light dark:bg-dark-blue-dark p-6 shadow-lg rounded-lg">
      <input 
        v-model="searchQuery" 
        placeholder="Rechercher un produit..." 
        class="w-full p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        @input="filterProducts"
      />

      <ul class="space-y-4">
        <li v-for="product in filteredProducts" :key="product.postgresId" class="bg-secondary-light dark:bg-dark-blue p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
          <div>
            <h2 class="text-xl font-semibold dark:text-white">{{ product.name }}</h2>
            <div class="mt-2">
              <p>Stock: 
                <input 
                  type="number" 
                  v-model="product.stock" 
                  class="w-24 p-2 ml-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  @blur="updateProductField(product.postgresId, 'stock', product.stock)"
                />
              </p>
              <p class="mt-1">Seuil d'alerte: 
                <input 
                  type="number" 
                  v-model="product.threshold" 
                  class="w-24 p-2 ml-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  @blur="updateProductField(product.postgresId, 'threshold', product.threshold)"
                />
              </p>
            </div>
          </div>
        </li>
      </ul>

      <Pagination v-slot="{ page }" v-model:page="currentPage" :total="maxProducts" :sibling-count="1" show-edges :default-page="1" class="flex justify-center mt-8">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst @click="goToPage(1)" class="text-black"/>
          <PaginationPrev @click="goToPage(page - 1)" class="text-black"/>
          <template v-for="(item, index) in items" :key="index">
            <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0 rounded-full bg-primary dark:bg-dark-blue-dark hover:bg-primary-light dark:hover:bg-dark-blue hover:text-white transition duration-150 ease-in-out" :variant="item.value === page ? 'default' : 'outline'" @click="goToPage(item.value)">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext @click="goToPage(page + 1)" class="text-black"/>
          <PaginationLast @click="goToPage(Math.ceil(maxProducts / maxProductsPerPage))" class="text-black"/>
        </PaginationList>
      </Pagination>

      <div class="mt-12">
        <h2 class="text-2xl font-semibold text-primary-dark dark:text-white mb-4">Graphique des stocks</h2>
        <BarChart
          :data="chartData"
          index="name"
          :categories="['Stock', 'Seuil']"
          :y-formatter="(tick) => typeof tick === 'number' ? tick.toString() : ''"
          class="max-w-4xl mx-auto"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/chart-bar';
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import { ProductService } from '@/composables/api/products.service.ts'; 
import { ref, onMounted, Ref, computed } from 'vue';
import { useNotificationStore } from "@/stores/notification.ts";

const notificationStore = useNotificationStore();
const products: Ref<mongoProduct[]> = ref<mongoProduct[]>([]);
const maxProductsPerPage = 9;
const maxProducts = ref(0);
const currentPage = ref(1);
const searchQuery = ref('');

onMounted(() => {
  fetchProducts();
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(product => 
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filterProducts = () => {
  currentPage.value = 1;
};

const fetchProducts = async () => {
  try {        
    const response = await ProductService().getAllMongoProducts({      
      page: currentPage.value,
      limit: maxProductsPerPage
    });
    
    products.value = response.products;
    maxProducts.value = response.totalCount;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchProducts();
};

const updateProductField = async (id: string, field: string, value: number) => {
  try {
    await ProductService().updateProduct(id, { [field]: value });
    notificationStore.add({ message: 'Produit mis à jour', timeout: 3000, type: 'success' });
    const index = products.value.findIndex(p => p.postgresId === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], [field]: value };
    }
  } catch (error) {
    notificationStore.add({ message: 'Erreur lors de la mise à jour du produit', timeout: 3000, type: 'error' });
    fetchProducts();
  }
};

const chartData = computed(() => {
  return filteredProducts.value.map(product => ({
    name: product.name,
    Stock: product.stock,
    Seuil: product.threshold
  }));
});
</script>

