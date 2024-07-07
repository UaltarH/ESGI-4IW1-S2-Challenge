<template>
    <ul class="flex w-full text-center font-bold h-full">
        <li v-for="(item) in menuItems" class="menu-item relative parent-item">
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
const {menuItems} = useMenuItems();

</script>  
<style scoped>

</style>
