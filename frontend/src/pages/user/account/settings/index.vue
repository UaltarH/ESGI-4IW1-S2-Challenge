<template>
  <div class="flex flex-col lg:flex-row py-12">
    <div class="tile">
      <svg width="90" height="90" viewBox="0 0 24 24" class="avatar avatar--small stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5M14 5H20M10 5L4 5M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM16 12H4M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19ZM8 19H20" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <h1>Mes paramètres</h1>
      <AccountSideMenu></AccountSideMenu>
    </div>
    <div class="flex-1 px-8 flex flex-col lg:flex-row gap-4 h-min">
      <section class="tile space-y-8 mt-5 mb-12 lg:mt-0 lg:mb-0 lg:items-start flex-1 max-h-min justify-start h-min">
        <h2 class="text-2xl font-bold mb-6">Préférences de notifications</h2>
        <div v-if="userPref" class="space-y-4 w-full">
          <div v-for="(value, key) in userPref" :key="key" class="flex items-center justify-between">
            <label :for="key" class="text-sm font-medium text-gray-700">
              {{ getPreferenceLabel(key) }}
            </label>
            <Switch v-model:checked="userPref[key]" :id="key" @update:checked="updatePreference(key)"/>
          </div>
        </div>
        <div v-else class="text-gray-500">Chargement des préférences...</div>
      </section>
      <section class="tile mt-5 lg:mt-0 lg:items-start flex-1 h-min">
        <h2 class="text-2xl font-bold mb-6">Sécurité</h2>
        <button class="btn btn--primary mb-4" aria-label="changer de mot de passe" @click="openModal('reset')">
          Changer mon mot de passe
          <svg class="fill-white dark:fill-dark-blue" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g id="Change_password">
                <path d="M464.4326,147.54a9.8985,9.8985,0,0,0-17.56,9.1406,214.2638,214.2638,0,0,1-38.7686,251.42c-83.8564,83.8476-220.3154,83.874-304.207-.0088a9.8957,9.8957,0,0,0-16.8926,7.0049v56.9a9.8965,9.8965,0,0,0,19.793,0v-34.55A234.9509,234.9509,0,0,0,464.4326,147.54Z"></path>
                <path d="M103.8965,103.9022c83.8828-83.874,220.3418-83.8652,304.207-.0088a9.8906,9.8906,0,0,0,16.8926-6.9961v-56.9a9.8965,9.8965,0,0,0-19.793,0v34.55C313.0234-1.3556,176.0547,3.7509,89.9043,89.9012A233.9561,233.9561,0,0,0,47.5674,364.454a9.8985,9.8985,0,0,0,17.56-9.1406A214.2485,214.2485,0,0,1,103.8965,103.9022Z"></path>
                <path d="M126.4009,254.5555v109.44a27.08,27.08,0,0,0,27,27H358.5991a27.077,27.077,0,0,0,27-27v-109.44a27.0777,27.0777,0,0,0-27-27H153.4009A27.0805,27.0805,0,0,0,126.4009,254.5555ZM328,288.13a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,328,288.13Zm-72,0a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,256,288.13Zm-72,0a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,184,288.13Z"></path>
                <path d="M343.6533,207.756V171.7538a87.6533,87.6533,0,0,0-175.3066,0V207.756H188.14V171.7538a67.86,67.86,0,0,1,135.7208,0V207.756Z"></path>
              </g>
            </g>
          </svg>
        </button>
        <button class="btn btn--danger mb-4" aria-label="supprimer mon compte" @click="openModal('delete')">
          Supprimer mon compte
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="stroke-white dark:stroke-dark-blue">
            <title>Supprimer</title>
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6M4 6H20M10 10V16M14 10V16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
  <ModaleForm
      v-if="showPasswordForm"
      title="Changement de mot de passe"
      :form-schema="passwordSchema"
      @close="showPasswordForm = false"
      @submit="changePassword"
  >

  </ModaleForm>
  <ModaleForm
      v-if="showDeleteModal"
      title="Supprimer mon compte"
      :form-schema="deleteSchema"
      @close="showDeleteModal = false"
      @submit="deleteAccount"
  >
    <template #content>
      <p class="text-danger mt-6">Attention, cette action est irréversible !</p>
    </template>
  </ModaleForm>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import AccountSideMenu from "@/components/AccountSideMenu.vue";
import { useUserStore } from "@/stores/user.ts";
import { UserPrefService } from "@/composables/api/userPref/userPref.service";
import { Switch } from '@/components/ui/switch';
import { UpdateUserPref as UpdateUserPrefType } from '@/composables/api/userPref/dto/inputRequest/updateUserPref.dto';
import { useNotificationStore } from "@/stores/notification.ts";
import ModaleForm from "@/components/common/modaleForm.vue";
import { z } from "zod";
import { formMessages } from "@/composables/formMessages.ts";
import { FormField } from "@/dto/formField.dto.ts";
import { UserService } from "@/composables/api/user.service";
import { useRouter } from "vue-router";

const notificationStore = useNotificationStore();
const router = useRouter();
const { requiredMessage, invalidStringMessage } = formMessages();
const userStore = useUserStore();
const userId = userStore.user.id;
const { getUserPref, updateUserPref } = UserPrefService();
const { checkUser, deleteUser, updateUser } = UserService();

const userPref = ref<UpdateUserPrefType | null>(null);
const showPasswordForm = ref(false);
const showDeleteModal = ref(false);

const passwordSchema: FormField[] = [
  {
    label: "Mot de passe actuel",
    component: "input",
    type: "password",
    name: "password",
    placeholder: "Entrez votre mot de passe",
    schema: z.object({
      password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(32, { message: "Le mot de passe doit contenir au maximum 32 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
  },
  {
    label: "Nouveau mot de passe",
    component: "input",
    type: "password",
    name: "newPassword",
    placeholder: "Entrez votre mot de passe",
    schema: z.object({
      newPassword: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(32, { message: "Le mot de passe doit contenir au maximum 32 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
    differentFrom: { field: "password", errorMessage: "Le nouveau mot de passe doit être différent de l'ancien" },
  },
  {
    label: "Confirmation du mot de passe",
    component: "input",
    type: "password",
    name: "passwordConfirmation",
    placeholder: "Confirmez votre mot de passe",
    schema: z.object({
      passwordConfirmation: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
    dependsOn: { field: "newPassword", errorMessage: "Les mots de passe ne correspondent pas" },
  }
];
const deleteSchema: FormField[] = [
  {
    label: "Mot de passe",
    component: "input",
    type: "password",
    name: "password",
    placeholder: "Entrez votre mot de passe",
    schema: z.object({
      password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(32, { message: "Le mot de passe doit contenir au maximum 32 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
  },
  {
    label: "Confirmer la suppression",
    component: "input",
    type: "text",
    name: "confirm",
    placeholder: "Entrez 'Je souhaite supprimer mon compte' pour confirmer",
    schema: z.object({
      confirm: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .regex(/^je souhaite supprimer mon compte$/i, { message: "Veuillez entrer 'Je souhaite supprimer mon compte' pour confirmer la suppression" }),
    }),
    col: 0,
  }
];

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
function openModal(modal: string) {
  if (modal === 'reset') {
    showPasswordForm.value = true;
    showDeleteModal.value = false;
  } else if (modal === 'delete') {
    showDeleteModal.value = true;
    showPasswordForm.value = false;
  }
}
async function deleteAccount(data: { password: string, confirm: string }) {
  const checkResponse = await checkUser(userStore.user.id, data.password);
  if (checkResponse.status === 200) {
    const deleteResponse = await deleteUser(userStore.user.id);
    if(deleteResponse.status === 204) {
      showDeleteModal.value = false;
      notificationStore.add({ message: 'Votre compte a été supprimé.', timeout: 6000, type: 'success' });
      userStore.deleteUser();
    } else {
      notificationStore.add({ message: 'Erreur lors de la suppression du compte', timeout: 3000, type: 'error' });
    }
  } else if(checkResponse.status === 401) {
    notificationStore.add({message: 'Mot de passe incorrect', timeout: 3000, type: 'error'});
  } else {
    notificationStore.add({message: 'Erreur lors de la vérification du mot de passe', timeout: 3000, type: 'error'});
  }
}

async function changePassword(data: { password: string, newPassword: string, passwordConfirmation: string }) {
  await fetchChangePassword(data);
}

const fetchChangePassword = async (param: { [key: string]: string }) => {
  await updateUser( userStore.user.id, param, handleChangeResponse);
}

async function handleChangeResponse(res:Response) {
  if (res.status === 204) {
    notificationStore.add({type: 'success', message: 'Changement de mot de passe effectué.', timeout: 3000});
    showPasswordForm.value = false;
  } else if (res.status === 403) {
    router.push('/403');
  } else {
    setTimeout(() => {
      notificationStore.add({
        type: 'error',
        message: 'Une erreur est survenue, veuillez réessayer plus tard.',
        timeout: 3000
      });
    }, 3000);
  }
}
</script>