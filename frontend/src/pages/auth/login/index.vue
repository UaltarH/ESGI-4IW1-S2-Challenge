<template>
  <tab :tab1Title="'Connexion'" :tab2Title="'Inscription'" @changeTab="changeTab" />
  <Transition name="fade" mode="out-in">
    <Component :is="activeComp"></Component>
  </Transition>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref, shallowRef} from "vue";
import Tab from "@/components/ui/tab/Tab.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";
import { useUserStore } from "@/stores/user.ts";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const activeComp = shallowRef(LoginForm);
const activeTab = ref("tab1");

onBeforeMount(() => {
  if(userStore.user.id) {
    router.push('/');
  }
});

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