<template>
  <div class="notification">
    <p class="font-medium">{{ props.message }}</p>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>