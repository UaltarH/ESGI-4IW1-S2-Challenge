<script lang="ts" setup>
import btn from '@/components/ui/button/Button.vue';
import { AreaChart } from '@/components/ui/chart-area';
import { LineChart } from '@/components/ui/chart-line';
import { BarChart } from '@/components/ui/chart-bar';
import { DonutChart } from '@/components/ui/chart-donut';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  isEditing: Boolean,
});


const emit = defineEmits(["delete"]);
function deleteWidget() {
  emit("delete", props.data);
}
</script>
<template>
    <div
      :id="data.id"
      :gs-id="data.id"
      :gs-x="data.grid.x"
      :gs-y="data.grid.y"
      :gs-w="data.grid.w"
      :gs-h="data.grid.h"
    >
        <div
            class="grid-stack-item-content group relative p-4 bg-slate-800 highlight-white/5 rounded-md shadow-md flex items-center justify-center"
            :class="{ 'cursor-move': isEditing }"
        >
          <div class="w-full h-full flex flex-col items-center">
            <div class="self-start grow">
              <span class="text-xl text-gray-300">{{ data.title }}</span>
              <p class="text-sm text-gray-400">{{ data.description }}</p>
            </div>
            <div class="w-full grow">
              <AreaChart v-if="data.chartType == 'area'" :data="data.data" :index="data.indexData" :categories="data.categoriesData" />
              <LineChart v-else-if="data.chartType == 'line'" :data="data.data" :index="data.indexData" :categories="data.categoriesData" />
              <BarChart v-else-if="data.chartType == 'bar'" :data="data.data" :index="data.indexData" :categories="data.categoriesData" />
              <DonutChart v-else-if="data.chartType == 'donut'" :data="data.data" :index="data.indexData" :category="data.categoriesData['total']" />
            </div>
          </div>
          <btn 
              class="hidden group-hover:block absolute top-2 right-2" 
              variant="destructive" 
              v-if="isEditing" 
              @click="deleteWidget">
                  Supprimé
          </btn>
      </div>
    </div>
  </template>
  