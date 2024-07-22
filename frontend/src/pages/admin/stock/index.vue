<template>
    <div>
        <h1>Gestion des stocks</h1>
        <div>
            <input 
              v-model="searchQuery" 
              placeholder="Rechercher un produit..." 
              class="w-full p-2 mb-4 border rounded"
              @input="filterProducts"
            />
            <ul>
                <li v-for="product in filteredProducts" :key="product.postgresId">
                  <div>
                    <h2>{{ product.name }}</h2>
                    <p>
                      Stock: 
                      <input 
                        type="number" 
                        v-model="product.stock" 
                        @blur="updateProductField(product.postgresId, 'stock', product.stock)"
                      />
                    </p>
                    <p>
                      Seuil d'alerte: 
                      <input 
                        type="number" 
                        v-model="product.threshold" 
                        @blur="updateProductField(product.postgresId, 'threshold', product.threshold)"
                      />
                    </p>
                  </div>
                </li>
              </ul>
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

            <div class="mt-8">
                <h2>Graphique des stocks</h2>
                <BarChart
                  :data="chartData"
                  index="name"
                  :categories="['Stock', 'Seuil']"
                  :y-formatter="(tick) => typeof tick === 'number' ? tick.toString() : ''"
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
import {
  Button,
} from '@/components/ui/button';
import { BarChart } from '@/components/ui/chart-bar';
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import { ProductService } from '@/composables/api/products.service.ts'; 
import { ref, onMounted, Ref, computed } from 'vue';
import { useNotificationStore } from "@/stores/notification.ts";

const notificationStore = useNotificationStore();
const products:Ref<mongoProduct[]> = ref<mongoProduct[]>([]);
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