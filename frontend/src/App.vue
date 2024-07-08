<script setup lang="ts">
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
import {onMounted} from "vue";
import {useDarkMode} from "@/composables/useDarkMode";

const { loadDarkModePreference } = useDarkMode();
onMounted(() => {
  loadDarkModePreference();
});
</script>

<template>
  <MainHeader></MainHeader>
  <main class="mx-12 min-h-screen">
    <router-view></router-view>
  </main>
  <MainFooter></MainFooter>
</template>

<style scoped>
</style>
