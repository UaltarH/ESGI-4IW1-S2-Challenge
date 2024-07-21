<template>
    <ul class="flex w-full text-center font-bold h-full">
        <li v-for="(item) in filtererMenuItems" class="menu-item relative parent-item">
          <!-- item has children -->
          <RouterLink v-if="item.hasOwnProperty('children') && item.route !== ''" :to="item.route" class="menu-link">
            {{ item.title }}
          </RouterLink>
          <span v-if="item.hasOwnProperty('children') && item.route == ''" class="menu-link">
            {{ item.title }}
          </span>
          <ul v-if="item.hasOwnProperty('children')" class="menu-submenu absolute mt-2.5">
            <li v-for="(subItem) in item.children" class="menu-item menu-subitem h-12 text-center">
              <RouterLink :to="subItem.route" class="menu-link">
                {{ subItem.title }}
              </RouterLink>
            </li>
          </ul>
          <!-- item has no children -->
          <RouterLink v-else :to="item.route" class="menu-link">
            {{ item.title }}
          </RouterLink>
        </li>
      </ul>
  </template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import {useMenuItems} from "@/composables/useMenuItems";
import {useUserStore} from "@/stores/user.ts";
import { role } from '@/dto/role.dto.ts';
import {ref, watch} from "vue";

const {menuItems} = useMenuItems();
const userStore = useUserStore();

const filterMenu = () => {
  return menuItems.filter((item) => {
    if (item.access == 'all') {
      return true;
    }
    if (item.access == role.USER) {
      return (Object.values(role).includes(userStore.user.role));
    }
    if (item.access == role.ADMIN) {
      return userStore.user.role === role.ADMIN;
    }
  });
}
const filtererMenuItems = ref(filterMenu());

watch(() => userStore.user, () => {
  filtererMenuItems.value = filterMenu();
});

</script>  
<style scoped>

</style>
