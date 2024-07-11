<template>
  <RouterLink
      to="/auth"
      class="hidden lg:block menu-link hover:bg-primary-light px-2 py-2.5"
      @click="emit('close')"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" class="fill-dark-blue" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
    </svg>
  </RouterLink>
  <ul class="menu-submenu absolute mt-2.5 !top-10" v-if="user.id">
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

const { profileMenuItems } = useMenuItems();
const user = useUserStore();
const emit = defineEmits(["close"]);
</script>