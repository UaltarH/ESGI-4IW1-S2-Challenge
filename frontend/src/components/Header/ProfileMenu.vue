<template>
  <RouterLink
      v-if="!isConnected"
      to="/auth"
      class="hidden lg:block menu-link hover:bg-primary-light px-2 py-2.5"
      @click="emit('close')"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" class="fill-dark-blue" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
    </svg>
  </RouterLink>
  <span v-else class="hidden lg:block menu-link hover:bg-primary-light px-2 py-2.5">
    <svg viewBox="212.5 211.7 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <g transform="matrix(1, 0, 0, 1, 7.105427357601002e-15, 0.6919970019459356)">
        <circle cx="224.5" cy="217.008" r="4" fill="#1C274C"/>
        <path d="M 232.5 228.508 C 232.5 230.993 232.5 233.008 224.5 233.008 C 216.5 233.008 216.5 230.993 216.5 228.508 C 216.5 226.023 220.081 224.008 224.5 224.008 C 228.918 224.008 232.5 226.023 232.5 228.508 Z" fill="#1C274C"/>
      </g>
      <circle style="stroke: rgb(28, 39, 76); fill: rgb(36, 183, 102);" cx="233.412" cy="215.264" r="2" transform="matrix(1, 0, 0, 0.9999989867210387, -0.5398759922366665, -0.5398610314706218)"/>
    </svg>
  </span>
  <ul class="menu-submenu absolute mt-2.5 !top-9" v-if="isConnected">
    <li v-for="(item) in profileMenuItems" class="menu-item menu-subitem h-12 text-center">
      <RouterLink :to="item.route" class="menu-link">
        {{ item.title }}
      </RouterLink>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { useMenuItems } from "@/composables/useMenuItems.ts";
import { useUserStore} from "@/stores/user.ts";
import {ref} from "vue";

const { profileMenuItems } = useMenuItems();
const userStore = useUserStore();
userStore.$subscribe((state) => {
  isConnected.value = !!state.events.newValue;
});
let isConnected = ref(!!userStore.user.id);
const emit = defineEmits(["close"]);
</script>