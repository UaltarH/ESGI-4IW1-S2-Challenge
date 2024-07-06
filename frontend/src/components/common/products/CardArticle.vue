<template>
    <Card class="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <img :src="image" alt="Article Image" class="w-full h-48 object-cover">
      <div class="p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">{{ name }}</h2>
          <span class="text-gray-700">{{ price.toFixed(2) }}€</span>
        </div>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </Card>
</template>
  
<script lang="ts" setup>
import { Card } from '@/components/ui/card';

  defineProps<{
    image: string;
    name: string;
    description: string;
    price: number;
  }>();
</script>
    