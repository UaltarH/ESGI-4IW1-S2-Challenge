<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Information du produit</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(value, key) in product" :key="key" class="flex flex-col">
          <label class="font-semibold capitalize">{{ key }}</label>
          <span class="text-gray-700">
            {{ formatValue(value, key) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductService } from "@/composables/api/products.service.ts";
import { useCategoryManagement } from "@/composables/useCategoryManagement.ts";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { mongoProduct } from '@/dto/MongoProduct.dto';
import { Category } from '@/dto/category.dto';

const route = useRoute();

const { getSpecificMongoProduct } = ProductService();
const { getCategories } = useCategoryManagement();

const product = ref<mongoProduct | undefined>();
const categories = ref<Category[]>([]);

getSpecificMongoProduct(route.params.id, (datas: []) => datas).then(res => product.value = res.product);
getCategories().then(res => categories.value = res.categories);

const formatValue = (value: any, key: string) => {
  if (key === 'createdAt' || key === 'updatedAt') {
    return value ? new Date(value).toLocaleDateString() : 'N/A';
  }
  return value || 'N/A';
};
</script>
