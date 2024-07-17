<template>
  <footer class="w-full border-t border-gray-200 dark:border-[#3a3960] py-4 px-2">
    <div class="flex flex-col w-full items-center m-auto">
      <div class="row flex flex-col lg:flex-row w-full items-center justify-between">
        <p>© 2024. BoxToBe - All Rights Reserved.</p>
        <div class=" text-right">
          <ul>
            <li>
              <a class="flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 hover:bg-gray-50 dark:hover:bg-dark-blue-dark inline-flex items-center" aria-label="BoxToBe sur X" href="https://x.com/" rel="noopener noreferrer" target="_blank">
              <x class="fill-black dark:fill-white"></x>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import X from "@/components/icons/x.vue";
</script>