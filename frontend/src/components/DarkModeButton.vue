<template>
  <button type="button" id="dark-mode-toggle" class="switch" @click="toggleDarkMode" aria-label="dark mode button">
    <span class="slider round"></span>
  </button>
</template>
<script lang="ts" setup>
import { useDarkMode } from "@/composables/useDarkMode";
const { toggleDarkMode } = useDarkMode();
</script>