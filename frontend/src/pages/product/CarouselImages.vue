<template>
    <Carousel class="relative w-full">
      <CarouselContent>
        <CarouselItem v-for="(image, index) in images" :key="index">
          <div class="p-1">
            <Card class="bg-dark-blue-dark border-gray-950">
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <img :src="image" alt="Image" class="w-full h-full object-cover rounded-lg shadow-md">
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
  import { Card, CardContent } from '@/components/ui/card';
  
  defineProps<{
    images: string[];
  }>();
  </script>
  