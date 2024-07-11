<template>
  <div class="flex min-h-screen bg-gray-100">
    <div class="bg-primary text-white w-64 p-4">
      <h2 class="text-2xl font-semibold mb-6">Admin Panel</h2>
      <ul>
        <li v-for="item in adminItems" :key="item.route" class="mb-4">
          <router-link :to="item.route" class="text-white hover:text-primary-light">
            {{ item.title }}
          </router-link>
          <ul v-if="item.children" class="ml-4">
            <li v-for="child in item.children" :key="child.route" class="mb-2">
              <router-link :to="child.route" class="text-white hover:text-primary-light">
                {{ child.title }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="flex-1 p-4 overflow-hidden">
      <router-view></router-view>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
  import { useMenuItems } from '@/composables/useMenuItems'; 
  
  const { adminItems } = useMenuItems();
</script>
  