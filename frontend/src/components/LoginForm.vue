<template>
  <section class="pt-24 mx-12 lg:mx-auto mb-12 lg:w-1/2">
    <Form
        :schema="loginSchema"
        submit-text="Connexion"
        @submit="handleLogin"
        :show-reset="false"
        :disabled="disabled"
        :loading="loading"
    />
  </section>
</template>
<script lang="ts" setup>

import Form from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import { useUserStore } from "@/stores/user.ts";
import { formMessages } from "@/composables/formMessages";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useNotificationStore } from "@/stores/notification.ts";

const router = useRouter();
const user = useUserStore();
const notificationStore = useNotificationStore();
const { requiredMessage, invalidStringMessage } = formMessages();

const disabled = ref(false);
const loading = ref(false);

const loginSchema: FormField<any>[] = [
  {
    label: "Email",
    component: "input",
    type: "email",
    name: "email",
    placeholder: "Entrez votre email",
    schema: z.object({
      email: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .regex(/[\w\.]{1,20}@[\w\-_]{1,20}\.[a-z]{2,3}/, { message: "Le format de l'e-mail est invalide" }),
    }),
    col: 0,
  },
  {
    label: "Mot de passe",
    component: "input",
    type: "password",
    name: "password",
    placeholder: "Entrez votre mot de passe",
    schema: z.object({
      password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
          .max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/,
              { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 0,
  }];


async function handleLogin(schema: FormField<any>[]) {
  disabled.value = true;
  loading.value = true;
  // build param
  let param: { [key: string]: string } = {};
  schema.forEach((item) => {
    if (item.value !== undefined)
      param[item.name] = item.value;
  });
  await fetchLogin(param);
}

const fetchLogin = async (param: { [key: string]: string }) => {
  await user.login(param, handleLoginResponse);
}

function handleLoginResponse(code: number) {
  if(code === 200) {
    notificationStore.add({type: 'success', message: 'Connexion réussie', timeout: 3000})
    setTimeout(() => {
      router.push({name: 'home'});
    }, 1000);
  } else if(code === 401) {
    setTimeout(() => {
      disabled.value = false;
      loading.value = false;
      notificationStore.add({type: 'error', message: 'L\'identifiant ou le mot de passe sont incorrects', timeout: 3000})
    }, 3000);
  } else {
    setTimeout(() => {
      disabled.value = false;
      loading.value = false;
      notificationStore.add({type: 'error', message: 'Une erreur est survenue, veuillez réessayer plus tard.', timeout: 3000});
    }, 3000);
  }
}

</script>