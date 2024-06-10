<script setup lang="ts">
import MainMenu from "./components/MainMenu.vue";
import MainFooter from "./components/MainFooter.vue";
import {onMounted, ref} from "vue";
import {useMenuItems} from "./composables/useMenuItems";
import {useDarkMode} from "./composables/useDarkMode";

const {menuItems} = useMenuItems();
const { loadDarkModePreference } = useDarkMode();
onMounted(() => {
  loadDarkModePreference();
});
</script>

<template>
  <main-menu :menu-items="menuItems"></main-menu>
  <main>
    <router-view></router-view>
  </main>
  <main-footer></main-footer>
</template>

<style scoped>
</style>
