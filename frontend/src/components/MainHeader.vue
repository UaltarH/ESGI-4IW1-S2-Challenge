<template>
  <header class="bg-primary w-full h-16">
    <nav class="flex items-center flex-row justify-between w-full h-full">
      <h1 class="ml-3">
        <RouterLink to="/">
          <logo-with-text></logo-with-text>
        </RouterLink>
      </h1>
      <div class="hidden lg:flex h-full">
        <Menu></Menu>        
      </div>
      <div class="flex justify-between items-center">
        <dark-mode-button class="hidden lg:block mr-4"></dark-mode-button>
        <search-bar class="hidden lg:block"></search-bar>
        <RouterLink
          to="/register"
          class="hidden lg:block menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 mr-3"
          @click="closeMenu"
        >
          Connexion
        </RouterLink>
        <button type="button" class="lg:hidden mr-3" id="burger" @click="toggleMenu">
          <burger class="fill-dark-blue hover:fill-white" aria-label="Openu menu"></burger>
        </button>
      </div>
    </nav>

    <!-- Mobile header -->
    <div v-if="menuOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" @click="closeMenu">
      <div class="fixed right-0 top-0 w-72 h-full bg-white dark:bg-gray-800 shadow-md z-50" @click.stop>
        <div class="flex flex-col items-center">
          <div class="flex justify-around items-center h-[60px] w-full">
            <RouterLink to="/register" class="menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700" @click="closeMenu">
              Connexion
            </RouterLink>
            <dark-mode-button></dark-mode-button>
          </div>
          <search-bar class="w-[83%] mb-[3%]"></search-bar>  
          <MenuMobile></MenuMobile>
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import DarkModeButton from "@/components/DarkModeButton.vue";
import LogoWithText from "@/components/icons/logoWithText.vue";
import Burger from "@/components/icons/burger.vue";
import SearchBar from "@/components/SearchBar.vue";
import Menu from "@/components/Menu.vue";
import MenuMobile from "@/components/MenuMobile.vue";

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};
</script>
