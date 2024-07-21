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
          <li v-if="isConnected" class="menu-item relative parent-item min-w-16 cursor-pointer" @click="openNotificationPanel">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24 " class="fill-dark-blue">
                <path d="M 12 2 C 11.172 2 10.5 2.672 10.5 3.5 L 10.5 4.1953125 C 7.9131836 4.862095 6 7.2048001 6 10 L 6 16 L 4.4648438 17.15625 L 4.4628906 17.15625 A 1 1 0 0 0 4 18 A 1 1 0 0 0 5 19 L 12 19 L 19 19 A 1 1 0 0 0 20 18 A 1 1 0 0 0 19.537109 17.15625 L 18 16 L 18 10 C 18 7.2048001 16.086816 4.862095 13.5 4.1953125 L 13.5 3.5 C 13.5 2.672 12.828 2 12 2 z M 10 20 C 10 21.1 10.9 22 12 22 C 13.1 22 14 21.1 14 20 L 10 20 z"></path>
              </svg>
            </div>
          </li>
          <li class="menu-item parent-item min-w-16">
            <menu-cart @open-cart-modal="handleOpenCartModal" class="hidden lg:block menu-link hover:bg-primary-light px-2 py-2.5"></menu-cart>
          </li>
        </ul>
        <div v-if="isConnected" class="lg:hidden mr-3 cursor-pointer" @click="openNotificationPanel">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 24 24 " class="fill-dark-blue">
              <path d="M 12 2 C 11.172 2 10.5 2.672 10.5 3.5 L 10.5 4.1953125 C 7.9131836 4.862095 6 7.2048001 6 10 L 6 16 L 4.4648438 17.15625 L 4.4628906 17.15625 A 1 1 0 0 0 4 18 A 1 1 0 0 0 5 19 L 12 19 L 19 19 A 1 1 0 0 0 20 18 A 1 1 0 0 0 19.537109 17.15625 L 18 16 L 18 10 C 18 7.2048001 16.086816 4.862095 13.5 4.1953125 L 13.5 3.5 C 13.5 2.672 12.828 2 12 2 z M 10 20 C 10 21.1 10.9 22 12 22 C 13.1 22 14 21.1 14 20 L 10 20 z"></path>
            </svg>
          </div>
        </div>
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
  <NotificationPanel :show="isNotificationPanelOpen" @close="closeNotificationPanel"></NotificationPanel>
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
import CartModal from "@/components/cart/CartModal.vue";
import ProfileMenu from "@/components/Header/ProfileMenu.vue";
import NotificationPanel from "@/components/Header/notification/NotificationPanel.vue";
import { useUserStore } from "@/stores/user.ts";

const menuOpen = ref(false);
const isCartModalOpen = ref(false);
const isNotificationPanelOpen = ref(false);
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

const openNotificationPanel = () => {
  isNotificationPanelOpen.value = true;
}

const closeNotificationPanel = () => {
  isNotificationPanelOpen.value = false;
}

</script>
