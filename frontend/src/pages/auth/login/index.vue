<template>
  <tab :tab1Title="'Connexion'" :tab2Title="'Inscription'" @changeTab="changeTab" />
  <Transition name="fade" mode="out-in">
    <Component :is="activeComp"></Component>
  </Transition>
</template>

<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import Tab from "@/components/ui/tab/Tab.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";

const activeComp = shallowRef(LoginForm);
const activeTab = ref("tab1");

function changeTab(tab: string) {
  activeTab.value = tab;
  if(activeTab.value === 'tab1')
    activeComp.value = LoginForm;
  if(activeTab.value === 'tab2')
    activeComp.value = RegisterForm;
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