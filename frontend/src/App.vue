<script setup lang="ts">
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
import {onMounted} from "vue";
import {useDarkMode} from "@/composables/useDarkMode";
import Notification from "@/components/ui/notification/Notification.vue";

const { loadDarkModePreference } = useDarkMode();
onMounted(() => {
  loadDarkModePreference();
});
</script>

<template>
  <MainHeader></MainHeader>
  <main class="min-h-screen">
    <router-view></router-view>
  </main>
  <MainFooter></MainFooter>
  <Notification/>
</template>

<style scoped>
</style>
