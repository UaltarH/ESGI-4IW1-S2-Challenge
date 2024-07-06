<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ArticleCard from '@/components/common/products/CardArticle.vue';
import { mongoArticle } from '@/dto/MongoArticle.dto.ts';
import Autoplay from 'embla-carousel-autoplay'

defineProps<{
  contents: mongoArticle[];
}>()
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
            <ArticleCard          
            :image="'https://via.placeholder.com/150'"
            :name="content.name"
            :description="content.description"
            :price="content.price"
            />
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>