<template>
  <div v-if="props.show" class="overflow-hidden w-full h-full">
    <div class="cart-modal--mask" @click="handleClose"></div>
    <div class="cart-modal w-3/4 right-0 lg:w-1/4 justify-normal">
      <header class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Notifications</h2>        
        <button type="button" @click="handleClose" class="text-2xl">&times;</button>
      </header>
      <div v-if="userRole == role.ADMIN">
        <tab :tab1Title="'Utilisateur'" :tab2Title="'Admin'" @changeTab="changeTab" class="mt-1" />
        <Transition name="fade" mode="out-in">
          <Component :is="activeComp"></Component>
        </Transition>
      </div>
      <div v-if="userRole == role.USER">
        <NotificationUser></NotificationUser>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { role } from "@/dto/role.dto.ts";
import { onUnmounted, ref, shallowRef, watch } from "vue";
import Tab from "@/components/ui/tab/Tab.vue";
import { useUserStore } from "@/stores/user.ts";
import NotificationUser from "@/components/Header/notification/NotificationUser.vue";
import NotificationAdmin from "@/components/Header/notification/NotificationAdmin.vue";

const emits = defineEmits(["close"]);
const props = defineProps({
  show: Boolean,
});
const userStore = useUserStore();

const userRole = userStore.user.role;

const activeComp = shallowRef(NotificationUser);
const activeTab = ref("tab1");

function changeTab(tab: string) {
  activeTab.value = tab;
  if(activeTab.value === 'tab1')
    activeComp.value = NotificationUser;
  if(activeTab.value === 'tab2')
    activeComp.value = NotificationAdmin;
}

function resetNotificationPanel() {
  activeTab.value = "tab1";
  activeComp.value = NotificationUser;
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    // Le panneau vient d'être ouvert
    resetNotificationPanel();
  }
});

onUnmounted(() => {
  emits("close");
  resetNotificationPanel();
});

function handleClose() {
  emits("close");
  resetNotificationPanel();
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