<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ProductCard from '@/components/common/products/CardProduct.vue';
import { mongoProduct } from '@/dto/MongoProduct.dto.ts';
import Autoplay from 'embla-carousel-autoplay'

defineProps<{
  contents: mongoProduct[];
}>()

const getImageUrl = () => {
  const images = [
    '/products/exemple/cartonExemple.png',
    '/products/exemple/cat.png',
    '/products/exemple/snake.png',
  ];
  return images[Math.floor(Math.random() * images.length)];
};
</script>

<template>
  <Carousel
    class="relative w-[80%]"
    :opts="{
      align: 'start',
    }"
    :plugins="[Autoplay({
        delay: 2000,
      })]"
  >
    <CarouselContent class="-ml-1">
      <CarouselItem v-for="(content, index) in contents" :key="index" class="pl-1 md:basis-1/2 lg:basis-1/3 h-full">
        <div class="p-1">
          <RouterLink :to="`/product/${content._id}`">
            <ProductCard          
            :image="getImageUrl()"
            :name="content.name"
            :description="content.description"
            :price="content.price"
            :in-stock="content.stock > 0"
            />
          </RouterLink>

        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>