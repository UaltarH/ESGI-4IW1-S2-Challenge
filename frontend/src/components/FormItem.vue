<template>
  <div class="form-item">
    <slot name="label"></slot>
    <slot name="component"></slot>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps();
</script>