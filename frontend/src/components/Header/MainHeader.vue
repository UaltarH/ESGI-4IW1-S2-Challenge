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
      <nav class="mr-3 flex items-center">
        <ul class="lg:flex justify-between items-center gap-0.5 h-full hidden">
          <li class="menu-item relative parent-item hover:!bg-transparent">
            <dark-mode-button class="hidden lg:block"></dark-mode-button>
          </li>
          <li class="menu-item parent-item min-w-16">
            <search-bar></search-bar>
          </li>
          <li class="menu-item relative parent-item min-w-16">
            <profile-menu @close="closeMenu"/>
          </li>
          <li class="menu-item parent-item min-w-16">
            <menu-cart @open-cart-modal="handleOpenCartModal" class="hidden lg:block menu-link hover:bg-primary-light px-2 py-2.5"></menu-cart>
          </li>
        </ul>
        <button type="button" class="lg:hidden mr-3" id="burger" @click="toggleMenu">
          <burger class="fill-dark-blue dark:fill-white" aria-label="Openu menu"></burger>
        </button>
      </nav>
    </nav>

    <!-- Mobile header -->
    <div v-if="menuOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" @click="closeMenu">
      <div class="fixed right-0 top-0 w-full h-full bg-white dark:bg-gray-800 shadow-md z-50" @click.stop>
        <div class="flex flex-col items-center">
          <div class="flex justify-around items-center h-[60px] w-full">
            <RouterLink v-if="!isConnected" to="/auth" class="menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5" @click="closeMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" class="fill-dark-blue dark:fill-white" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="4"/>
                <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
              </svg>
            </RouterLink>
            <RouterLink v-else to="/user/account" class="menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5" @click="closeMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" class="fill-dark-blue dark:fill-white" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="4"/>
                <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
              </svg>
            </RouterLink>
            <menu-cart @open-cart-modal="handleOpenCartModal" :dark-mode="true"></menu-cart>
            <RouterLink v-if="isConnected" to="/logout" class="menu-link rounded-md hover:bg-primary-light px-3.5 py-2.5" @click="closeMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4L18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
            <dark-mode-button></dark-mode-button>
            <button type="button" class="lg:hidden mr-3" id="burger" @click="toggleMenu">
              <burger class="fill-dark-blue dark:fill-white" aria-label="Openu menu"></burger>
            </button>
          </div>
          <search-bar class="w-[83%] mb-[3%]" :dark-mode="true"></search-bar>
          <MenuMobile @close-menu="closeMenu"></MenuMobile>
        </div>
      </div>
    </div>
  </header>
  <cart-modal :show="isCartModalOpen" @close="handleCloseCartModal"></cart-modal>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import DarkModeButton from "@/components/DarkModeButton.vue";
import LogoWithText from "@/components/icons/logoWithText.vue";
import Burger from "@/components/icons/burger.vue";
import SearchBar from "@/components/Header/SearchBar.vue";
import Menu from "@/components/Header/Menu.vue";
import MenuMobile from "@/components/Header/MenuMobile.vue";
import MenuCart from "@/components/MenuCart.vue";
import CartModal from "@/components/CartModal.vue";
import ProfileMenu from "@/components/Header/ProfileMenu.vue";
import { useUserStore } from "@/stores/user.ts";

const menuOpen = ref(false);
const isCartModalOpen = ref(false);
const userStore = useUserStore();
const isConnected = computed(() => userStore.user.id);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
  handleCloseCartModal();
};
const handleOpenCartModal = () => {
  isCartModalOpen.value = true;
}
const handleCloseCartModal = () => {
  isCartModalOpen.value = false;
}

</script>
