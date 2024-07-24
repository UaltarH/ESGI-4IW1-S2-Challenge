<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal" :style="`width:${getSize()}`">
      <header class="w-full flex-0.5 relative">
        <h1 class="text-xl">{{ title }}</h1>
        <button
          type="button"
          class="absolute -right-4 -top-4 w-8 h-8 btn--cancel"
          @click="handleClose"
          aria-label="Close modal"
        >
          x
        </button>
      </header>
      <section class="w-full flex-2">
        <slot name="content">{{ content }}</slot>
      </section>
      <section class="w-full flex-1 min-h-4">
        <p v-if="error" class="message message--error">{{ error }}</p>
        <p v-if="success" class="message message--success">{{ success }}</p>
      </section>
      <footer class="w-full">
        <button 
          type="button" 
          @click="handleSubmit" 
          class="btn btn--confirm"
          aria-label="confirmer modal"
        >
          {{ confirmText }}
        </button>
        <button
          type="button" 
          @click="handleClose"
          class="btn btn--cancel hover:bg-gray-200"
          aria-label="annuler modal"
        >
          {{ cancelText }}
        </button>
      </footer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ApiResponse} from "@/dto/apiResponse.dto.ts";
import {onMounted, PropType, ref} from "vue";

onMounted(() => {
  resetModal();
});
const props = defineProps({
  title: String,
  content: String,
  confirmText: {
    type: String,
    default: 'Ok'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  size: {
    type: String,
    default: 'md'
  },
  data: {
    type: Object,
  },
  action: {
    type: (Function as PropType<(data: Object) => Promise<ApiResponse>>),
  }
});
const sizes:{[key:string]:string} = {
  'sm': '25%',
  'md': '50%',
  'lg': '75%',
  'xl': '100%',
};
const emit = defineEmits(['confirm', 'close']);

const error = ref<string>('');
const success = ref<string>('');

function handleSubmit() {
  if(!props.action || !props.data) {
    error.value = 'Une erreur est survenue';
    return;
  }
  props.action(props.data)
}
function handleClose() {
  emit('close');
}
function getSize() {
  return sizes[props.size];
}
function resetModal() {
  error.value = '';
  success.value = '';
}
</script>