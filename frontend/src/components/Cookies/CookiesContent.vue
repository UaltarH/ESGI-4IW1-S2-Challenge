<template>
  <div class="w-full px-4 lg:px-12">
    <tab :tab1Title="'Consentement'" :tab2Title="'Détails'" @changeTab="changeTab" class="mt-4" />
    <Transition name="fade" mode="out-in">
      <Component :is="activeComp" class="mb-8 w-full"></Component>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import Tab from "@/components/ui/tab/Tab.vue";
import { ref, shallowRef } from "vue";
import CookiesConsent from "@/components/Cookies/CookiesConsent.vue";
import CookiesDetails from "@/components/Cookies/CookiesDetails.vue";

const activeComp = shallowRef(CookiesConsent);
const activeTab = ref("tab1");

function changeTab(tab: string) {
  activeTab.value = tab;
  if (activeTab.value === 'tab1')
    activeComp.value = CookiesConsent;
  if (activeTab.value === 'tab2')
    activeComp.value = CookiesDetails;
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>