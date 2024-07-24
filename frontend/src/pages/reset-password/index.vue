<template>
  <div class="pt-24 mx-12 lg:mx-auto mb-12 lg:w-1/2">
    <template v-if="isTokenValid">
      <h1> Réinitialisation du mot de passe</h1>
      <CustomForm :schema="resetSchema" submit-text="Réinitialiser le mot de passe" @submit="handleSubmit" :show-reset="true" :disabled="disabled" :loading="loading">
      </CustomForm>
    </template>
    <template v-else>
      <h1>
        Le lien de réinitialisation du mot de passe est invalide ou a expiré.
        <br>
        Veuillez réessayer ou contacter le support.
      </h1>
    </template>

  </div>
</template>
<script setup lang="ts">
import CustomForm from "@/components/CustomForm.vue";

import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import {formMessages} from "@/composables/formMessages.ts";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { UserService } from "@/composables/api/user.service";
import {useNotificationStore} from "@/stores/notification.ts";

const { requiredMessage, invalidStringMessage } = formMessages();

const router = useRouter();
const notificationStore = useNotificationStore();
const { verifyResetToken, resetPassword } = UserService();
const route = useRoute()
const disabled = ref(false);
const loading = ref(false);
const isTokenValid = ref(false);

const token = ref('');

onMounted(async () => {
  token.value = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token;
  await verifyUserToken(token.value);
});

const resetSchema: FormField[] = [
  {
    label: "Mot de passe",
    component: "input",
    type: "password",
    name: "password",
    placeholder: "Entrez le nouveau mot de passe",
    schema: z.object({
      password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(32, { message: "Le mot de passe doit contenir au maximum 32 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
  },
  {
    label: "Confirmation du mot de passe",
    component: "input",
    type: "password",
    name: "passwordConfirmation",
    placeholder: "Confirmez le nouveau mot de passe",
    schema: z.object({
      passwordConfirmation: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
    dependsOn: { field: "password", errorMessage: "Les mots de passe ne correspondent pas" },
  }
];

async function handleSubmit(schema: FormField[]) {
  try {
    const password:string = <string>schema.find((field) => field.name === "password")?.value;
    const res = await resetPassword(token.value, password);
    if(res.status === 204) {
      notificationStore.add({ message: 'Votre mot de passe a été réinitialisé avec succès', timeout: 10000, type: 'success' });
      router.push('/auth');
    } else {
      notificationStore.add({ message: 'Une erreur est survenue, veuillez réessayer ultérieurement', timeout: 3000, type: 'error' });
    }
  }
  catch (e) {
    notificationStore.add({ message: 'Une erreur est survenue, veuillez réessayer ultérieurement', timeout: 3000, type: 'error' });
  }
}

async function verifyUserToken(token: string) {
    try {
      const response = await verifyResetToken(token);
      isTokenValid.value = response.status === 200;
    } catch (e) {
      isTokenValid.value = false;
    }
}
</script>