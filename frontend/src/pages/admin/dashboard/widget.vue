<script lang="ts" setup>
import btn from '@/components/ui/button/Button.vue'
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
        <span class="text-xl text-gray-300">
          {{ data.title }}
        </span>
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
  