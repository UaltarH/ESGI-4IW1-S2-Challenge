<template>
<div class="modal" :style="`width:${getSize()}`">
  <header class="w-full flex-0.5">
    <h1 class="text-xl">{{ title }}</h1>
  </header>
  <section class="w-full flex-2">
    <slot name="content">{{ content }}</slot>
  </section>
  <footer class="w-full">
    <button type="button" @click="handleSubmit" class="hover:">{{ confirmText }}</button>
    <button type="button" @click="handleClose" class="text-gray-400 hover:text-dark-blue-dark dark:text-gray-500 dark:hover:text-white hover:drop-shadow-2xl ">{{ cancelText }}</button>
  </footer>
</div>
</template>
<script lang="ts" setup>
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
  }
});
const sizes:{[key:string]:string} = {
  'sm': '25%',
  'md': '50%',
  'lg': '75%',
  'xl': '100%',
};
const emit = defineEmits(['confirm', 'close']);

function handleSubmit() {
  console.log('handleSubmit');
  emit('confirm');
}
function handleClose() {
  console.log('handleClose');
  emit('close');
}
function getSize() {
  console.log(`getSize : ${sizes[props.size]}`)
  return sizes[props.size];
}
</script>