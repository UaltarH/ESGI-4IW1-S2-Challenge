<template>
    <Card class="w-full bg-white dark:bg-dark-blue-dark shadow-md rounded-lg overflow-hidden dark:border-dark-blue-dark">
      <figure>
        <img :src="image" alt="product Image" class="w-full object-cover">
      </figure>
      <div class="p-4 flex justify-between items-start">
        <div class="flex flex-col justify-between items-start w-3/4">
          <h2 class="text-xl font-bold mb-1 whitespace-nowrap text-ellipsis overflow-hidden w-full dark:text-white">{{ name }}</h2>
          <p class="text-gray-500">Taille : <span class="font-medium">{{ size }}</span></p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-700 dark:text-white text-lg font-medium">{{ price.toFixed(2) }}€</p>
          <p v-if="inStock" class="text-sm text-success">En Stock</p>
          <p v-else class="text-sm text-danger-light">Épuisé</p>
        </div>
      </div>
    </Card>
</template>
  
<script lang="ts" setup>
import { Card } from '@/components/ui/card';

  defineProps({
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    inStock: {
      type: Boolean,
      required: true
    },
    size: {
      type: String,
      default: 'XL',
    }
  });
</script>
    