<template>
  <div class="flex min-h-screen bg-gray-100">
    <div class="bg-primary-light text-white w-64 p-4">
      <h2 class="text-2xl font-semibold mb-6">Admin Panel</h2>
      <ul>
        <li v-for="item in adminItems" :key="item.route" class="mb-4 w-full">
          <router-link :to="item.route" class="text-white hover:text-dark-blue text-lg mb-2 w-full bg-primary block p-2">
            {{ item.title }}
          </router-link>
          <ul v-if="item.children" class="ml-4">
            <li v-for="child in item.children" :key="child.route" class="">
              <router-link :to="child.route" class="text-white hover:text-dark-blue block w-full p-3 border-b hover:bg-primary">
                {{ child.title }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="flex-1 p-4 overflow-hidden dark:bg-dark-blue">
      <router-view></router-view>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
  import { useMenuItems } from '@/composables/useMenuItems'; 
  
  const { adminItems } = useMenuItems();
</script>
<style scoped>
.router-link-active {
  @apply border-l-4 border-l-white;
}
</style>