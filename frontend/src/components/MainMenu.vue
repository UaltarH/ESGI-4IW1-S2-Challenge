<template>
  <header class="bg-primary w-full h-12 fixed z-10">
    <nav class="lg:flex w-full lg:w-xl h-12 lg:items-center lg:flex-row m-auto relative">
      <h1 class="lg:flex-1 h-full"><RouterLink to="/" class="flex justify-center items-center lg:block h-full"><logo-with-text></logo-with-text></RouterLink></h1>
      <button type="button" class="absolute top-0 right-0 z-20 lg:hidden" id="burger" @click="toggleMenu"><burger class="fill-dark-blue hover:fill-white" aria-label="Openu menu"></burger></button>
      <div class="flex flex-col lg:flex-row lg:flex-2 absolute lg:static w-full h-screen lg:w-full lg:h-full bg-primary-light lg:bg-primary dark:fill-white dark:hover:fill-dark-blue top-0" :class="menuOpen ? '-right-0' : '-right-full' ">
        <ul class="flex flex-col lg:flex-row w-full lg:flex-2 py-32 lg:py-0 text-center font-bold">
          <li v-for= "(item, index) in menuItems" class="menu-item static lg:relative">
            <!-- item has children -->
            <RouterLink v-if="item.hasOwnProperty('children') && item.route !== ''" :to="item.route" class="font-medium">{{ item.title }}</RouterLink>
            <span v-if="item.hasOwnProperty('children') && item.route == ''" class="font-medium">{{ item.title }}</span>
            <ul v-if="item.hasOwnProperty('children')" class="menu-submenu static lg:absolute">
              <li v-for="(subItem, indexSub) in item.children" class="menu-item menu-subitem h-12 text-center"><RouterLink :to="subItem.route" class="font-medium">{{ subItem.title }}</RouterLink></li>
            </ul>
            <!-- item has no children -->
            <RouterLink v-else :to="item.route" class="menu-link" @click="closeMenu">{{ item.title }}</RouterLink>
          </li>
        </ul>
        <div class="flex flex-col lg:flex-row lg:flex-0.5 gap-2 items-center w-full">
          <RouterLink to="/login" class="menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700" @click="closeMenu">Connexion</RouterLink>
          <dark-mode-button></dark-mode-button>
        </div>
      </div>
    </nav>
  </header>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import DarkModeButton from "./DarkModeButton.vue";
import LogoWithText from "./icons/logoWithText.vue";
import Burger from "./icons/burger.vue";

const props = defineProps(['menuItems']);
const menuItems = ref(props.menuItems);

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
}
const closeMenu = () => {
  menuOpen.value = false;
}
</script>