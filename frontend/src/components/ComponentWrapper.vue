<template>
  <div :class="props.loading ? 'wrapper--loading' : ''" class="wrapper">
    <spinner v-if="props.loading"></spinner>
    <div class="wrapper__header" v-if="props.title">
      <h2>{{ props.title }}</h2>
    </div>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import Spinner from "@/components/Spinner.vue";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>