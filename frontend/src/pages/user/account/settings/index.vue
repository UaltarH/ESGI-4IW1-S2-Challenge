<template>
  <div class="flex flex-col lg:flex-row py-12">
    <div class="tile">
      <svg width="90" height="90" viewBox="0 0 24 24" class="avatar avatar--small stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5M14 5H20M10 5L4 5M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM16 12H4M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19ZM8 19H20" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <h1>Mes paramètres</h1>
      <AccountSideMenu></AccountSideMenu>
    </div>
    <div class="flex-1 px-8">
      <div class="flex flex-col space-y-8 mt-5 items-center lg:mt-O lg:items-start">
        <h2 class="text-2xl font-bold mb-6">Préférences de notifications</h2>
        <div v-if="userPref" class="space-y-4 w-[400px]">
          <div v-for="(value, key) in userPref" :key="key" class="flex items-center justify-between">
            <label :for="key" class="text-sm font-medium text-gray-700">
              {{ getPreferenceLabel(key) }}
            </label>
            <Switch  v-model:checked="userPref[key]" :id="key" @update:checked="updatePreference(key)" />
          </div>
        </div>
        <div v-else class="text-gray-500">Chargement des préférences...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import AccountSideMenu from "@/components/AccountSideMenu.vue";
import { useUserStore } from "@/stores/user.ts";
import { UserPrefService } from "@/composables/api/userPref/userPref.service";
import { Switch } from '@/components/ui/switch';
import { UpdateUserPref as UpdateUserPrefType } from '@/composables/api/userPref/dto/inputRequest/updateUserPref.dto';
import { useNotificationStore } from "@/stores/notification.ts";
const notificationStore = useNotificationStore();

const userStore = useUserStore();
const userId = userStore.user.id;
const { getUserPref, updateUserPref } = UserPrefService();

const userPref = ref<UpdateUserPrefType | null>(null);

onMounted(async () => {
  try {
    const { userPref: fetchedPref } = await getUserPref(userId);
    userPref.value = {
      newProduct: fetchedPref.newProduct,
      restockProduct: fetchedPref.restockProduct,
      priceChange: fetchedPref.priceChange
    };
  } catch (error) {
    notificationStore.add({ message: 'Erreur lors de la récupération des préférences', timeout: 3000, type: 'error' });
  }
});

const updatePreference = async (key: keyof UpdateUserPrefType) => {
  if (!userPref.value) return;

  try {
    await updateUserPref(userId, { [key]: userPref.value[key] });
    notificationStore.add({ message: 'Préférence mise à jour', timeout: 3000, type: 'success' });
  } catch (error) {
    notificationStore.add({ message: 'Erreur lors de la mise à jour de la préférence', timeout: 3000, type: 'error' });
    userPref.value[key] = !userPref.value[key];
  }
};

const getPreferenceLabel = (key: string): string => {
  const labels: Record<string, string> = {
    newProduct: 'Nouveaux produits',
    restockProduct: 'Réapprovisionnement de produits',
    priceChange: 'Changements de prix'
  };
  return labels[key] || key;
};
</script>