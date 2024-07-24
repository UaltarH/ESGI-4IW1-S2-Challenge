<template>
    <Form
        :schema="resetSchema"
        submit-text="Réinitialiser le mot de passe"
        @submit="handleReset"
        :show-reset="false"
        :disabled="disabled"
        :loading="loading"
    >
      <template #footer>
        <button type="button" aria-label="Se connecter" class="underline basis-full" @click="handleChange">Se connecter</button>
      </template>
    </Form>
</template>
<script lang="ts" setup>

import Form from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import { formMessages } from "@/composables/formMessages";
import { ref } from "vue";
import { useNotificationStore } from "@/stores/notification.ts";
import { UserService } from "@/composables/api/user.service";

const notificationStore = useNotificationStore();
const { requiredMessage, invalidStringMessage } = formMessages();
const { resetPasswordRequest } = UserService();

const disabled = ref(false);
const loading = ref(false);

const emits = defineEmits(["close"]);

const resetSchema: FormField<any>[] = [
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
  }];


async function handleReset(schema: FormField<any>[]) {
  disabled.value = true;
  loading.value = true;
  // build param
  const email:string = <string>schema.find((field) => field.name === "email")?.value;
  try {
    const res = await resetPasswordRequest(email);
    if(res.status === 200){
      notificationStore.add({ message: 'Une email avec un lien de réinitialisation a été envoyé dans votre boîte email. Le lien expirera dans 30 min.', timeout: 3000, type: 'success' });
    } else {
      notificationStore.add({ message: 'Une erreur est survenue, veuillez réessayer ultérieurement', timeout: 3000, type: 'error' });
    }
  } catch(e) {
    notificationStore.add({ message: 'Une erreur est survenue, veuillez réessayer ultérieurement', timeout: 3000, type: 'error' });
  }

  disabled.value = false;
  loading.value = false;
}
function handleChange() {
  emits("close");
}

</script>