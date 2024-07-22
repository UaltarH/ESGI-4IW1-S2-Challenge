<template>
  <div class="modal w-full lg:w-md lg:top-1/4">
    <header class="w-full flex-0.5 relative pb-4 border-b">
      <h1 class="text-xl">Changement de mot de passe</h1>
      <button
          type="button" class="absolute -right-4 -top-4 w-8 h-8 btn--cancel text-2xl"
          @click="handleClose"
          aria-label="Close modal"
      >
        &times
      </button>
    </header>
    <CustomForm
        v-if="passwordSchema.length > 0"
        ref="formRef"
        :schema="passwordSchema"
        submit-text="Sauvegarder"
        @submit="handleSubmit"
        :show-reset="false"
        :disabled="disabled"
        :loading="loading"
        :bordered="false"
    >
      <template #footer>
        <button type="button" class="btn btn--cancel" @click="handleClose">Annuler</button>
      </template>
    </CustomForm>
  </div>
</template>
<script lang="ts" setup >

import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import { useUserStore } from "@/stores/user.ts";
import { formMessages } from "@/composables/formMessages";
import { useRouter } from "vue-router";
import {onUnmounted, Ref, ref} from "vue";
import { useNotificationStore } from "@/stores/notification.ts";
import CustomForm from "@/components/CustomForm.vue";
import { UserService } from "@/composables/api/user.service.ts";

const router = useRouter();
const userStore = useUserStore();
const { updateUser } = UserService();
const notificationStore = useNotificationStore();
const { requiredMessage, invalidStringMessage } = formMessages();

const disabled = ref(false);
const loading = ref(false);

const emits = defineEmits(['close']);

const formRef = ref<{formRef:Ref<any>, SetFieldValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null);

onUnmounted(() => {
  disabled.value = false;
  loading.value = false;
});

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

async function handleSubmit(schema: FormField[]) {
  disabled.value = true;
  loading.value = true;
  // build param
  let param: { [key: string]: string } = {};
  schema.forEach((item) => {
    if (item.value !== undefined)
      param[item.name] = item.value;
  });
  await fetchChangePassword(param);
}

const fetchChangePassword = async (param: { [key: string]: string }) => {
  await updateUser( userStore.user.id, param, handleChangeResponse);
}

async function handleChangeResponse(res:Response) {
  loading.value = false;
  disabled.value = false;
  if (res.status === 204) {
    notificationStore.add({type: 'success', message: 'Changement de mot de passe effectué.', timeout: 3000});
    handleClose();
  } else if (res.status === 403) {
    router.push('/403');
  } else {
    setTimeout(() => {
      disabled.value = false;
      loading.value = false;
      notificationStore.add({
        type: 'error',
        message: 'Une erreur est survenue, veuillez réessayer plus tard.',
        timeout: 3000
      });
    }, 3000);
  }
}

function handleClose() {
  emits('close');
}

</script>