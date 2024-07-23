<template>
  <ol class="items-center sm:flex justify-center">
    <li class="relative mb-6 sm:mb-0" v-for="(status, index) in sortedStatuses" :key="status._id">
      <div class="flex items-center">
        <div class="z-10 flex items-center justify-center w-6 h-6 bg-[#C4997C] rounded-full ring-0 ring-white dark:white sm:ring-8 dark:ring-gray-900 shrink-0"></div>
        <div v-if="index !== sortedStatuses.length - 1" class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
      </div>
      <div class="mt-3 sm:pe-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ status.status }}</h3>
        <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ new Date(status.date).toLocaleString() }}</time>
      </div>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  statuses: {
    _id: string;
    statusId: string;
    status: string;
    date: string;
  }[];
}>();

const sortedStatuses = computed(() => {
  return [...props.statuses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
</script>
