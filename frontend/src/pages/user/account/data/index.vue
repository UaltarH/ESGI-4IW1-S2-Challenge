<template>
  <div class="flex flex-col lg:flex-row py-12 gap-2">
    <div class="tile lg:w-1/3">
      <svg width="90" height="90" viewBox="0 0 24 24" class="avatar avatar--small stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h1>Mes données</h1>
      <AccountSideMenu></AccountSideMenu>
    </div>
    <CustomForm
        ref="formRef"
        :schema="accountSchema"
        :show-reset="false"
        class="lg:w-2/3 rounded-none"
        :disabled="isDisabled"
        submit-text="Sauvegarder"
        @submit="handleSave"
    >
      <template #footer v-if="isDisabled">
        <button type="button" class="btn btn--primary" @click="isDisabled = false">
          Modifier
          <svg width="24" height="24" viewBox="0 0 24 24" class="fill-white dark:fill-dark-blue" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12L7.46967 11.4697C7.32902 11.6103 7.25 11.8011 7.25 12H8ZM17 3L17.5303 2.46967C17.2374 2.17678 16.7626 2.17678 16.4697 2.46967L17 3ZM21 7L21.5303 7.53033C21.8232 7.23744 21.8232 6.76256 21.5303 6.46967L21 7ZM12 16V16.75C12.1989 16.75 12.3897 16.671 12.5303 16.5303L12 16ZM8 16H7.25C7.25 16.4142 7.58579 16.75 8 16.75V16ZM20 20L20 20.75C20.1989 20.75 20.3897 20.671 20.5303 20.5303C20.671 20.3897 20.75 20.1989 20.75 20H20ZM4 20L3.25 20C3.25 20.4142 3.58579 20.75 4 20.75L4 20ZM4 4L4 3.25C3.58579 3.25 3.25 3.58579 3.25 4L4 4ZM12 4.75C12.4142 4.75 12.75 4.41421 12.75 4C12.75 3.58579 12.4142 3.25 12 3.25L12 4.75ZM20.75 12C20.75 11.5858 20.4142 11.25 20 11.25C19.5858 11.25 19.25 11.5858 19.25 12H20.75ZM8.53033 12.5303L17.5303 3.53033L16.4697 2.46967L7.46967 11.4697L8.53033 12.5303ZM16.4697 3.53033L20.4697 7.53033L21.5303 6.46967L17.5303 2.46967L16.4697 3.53033ZM20.4697 6.46967L11.4697 15.4697L12.5303 16.5303L21.5303 7.53033L20.4697 6.46967ZM12 15.25H8V16.75H12V15.25ZM8.75 16V12H7.25V16H8.75ZM13.4697 6.53033L17.4697 10.5303L18.5303 9.46967L14.5303 5.46967L13.4697 6.53033ZM20 19.25L4 19.25L4 20.75L20 20.75L20 19.25ZM4.75 20L4.75 4L3.25 4L3.25 20L4.75 20ZM4 4.75L12 4.75L12 3.25L4 3.25L4 4.75ZM19.25 12V20H20.75V12H19.25Z"/>
        </svg></button>
      </template>
    </CustomForm>
  </div>
</template>
<script lang="ts" setup>
import AccountSideMenu from "@/components/AccountSideMenu.vue"
import CustomForm from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import { formMessages } from "@/composables/formMessages.ts";
import { onBeforeMount, Ref, ref } from "vue";
import { UserService } from "@/composables/api/user.service.ts";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useNotificationStore } from "@/stores/notification";
import { User } from "@/dto/user.dto.ts";

const { getUserById, updateUser } = UserService();
const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

onBeforeMount(async () => {
  if (!userStore.user.id) {
    router.push("/auth");
  } else {
    await getUserById(
        userStore.user.id,
        handleUserInfo,
        {fields: ["firstname", "lastname", "email", "phone", "birthdate", "address", "zipcode", "city", "country"]}
    );
  }
});

const user = ref<User>();
const isDisabled = ref(true);

const formRef = ref<{formRef:Ref<any>, SetFieldValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null);

const { requiredMessage, invalidStringMessage, invalidDateMessage } = formMessages();
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);

const accountSchema:FormField<any>[] = [
  {
    label: "Nom",
    component: "input",
    type: "text",
    name: "lastname",
    placeholder: "Entrez votre nom",
    schema: z.object({
      lastname: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le nom doit contenir au moins 2 caractères" }).max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
    }),
    col: 2,
    disabled: true,
  },
  {
    label: "Prénom",
    component: "input",
    type: "text",
    name: "firstname",
    placeholder: "Entrez votre prénom",
    schema: z.object({
      firstname: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }).max(50, { message: "Le prénom doit contenir au maximum 50 caractères" })
    }),
    col: 2,
    disabled: true,
  },
  {
    label: "Email",
    component: "input",
    type: "email",
    name: "email",
    placeholder: "Entrez votre email",
    schema: z.object({
      email: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .email({ message: "L'email doit être valide" }).min(5, { message: "L'email doit contenir au moins 5 caractères" }).max(50, { message: "L'email doit contenir au maximum 50 caractères" }),
    }),
    col: 2,
  },
  {
    label: "Téléphone",
    component: "input",
    type: "tel",
    name: "phone",
    placeholder: "Entrez votre téléphone",
    schema: z.object({
      phone: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .regex(/^0[1-9]\d{8}$/, { message: "Le téléphone doit être au format 0XXXXXXXXX" })
          .optional(),
    }),
    col: 2,
  },
  {
    label: "Date de naissance",
    component: "input",
    type: "date",
    name: "birthdate",
    placeholder: "Entrez votre date de naissance",
    schema: z.object({
      birthdate: z.coerce.date({ required_error: requiredMessage, invalid_type_error: invalidDateMessage })
          .min(minDate, { message: "Vous devez avoir au maximum 120 ans" }).max(maxDate, { message: "Vous devez avoir au moins 18 ans" }),
    }),
    disabled: true,
  },
  {
    label: "Adresse",
    component: "input",
    type: "text",
    name: "address",
    placeholder: "Entrez votre adresse",
    schema: z.object({
      address: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(5, { message: "L'adresse doit contenir au moins 5 caractères" }).max(100, { message: "L'adresse doit contenir au maximum 100 caractères" }),
    }),
    col: 2,
  },
  {
    label: "Code postal",
    component: "input",
    type: "text",
    name: "zipcode",
    placeholder: "Entrez votre code postal",
    schema: z.object({
      zipcode: z.coerce.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(5, { message: "Le code postal doit contenir 5 chiffres" })
          .max(5, { message: "Le code postal doit contenir 5 chiffres" })
          .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres" }),
    }),
    col: 2,
  },
  {
    label: "Ville",
    component: "input",
    type: "text",
    name: "city",
    placeholder: "Entrez votre ville",
    schema: z.object({
      city: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "La ville doit contenir au moins 2 caractères" }).max(50, { message: "La ville doit contenir au maximum 50 caractères" }),
    }),
    col: 2,
  },
  {
    label: "Pays",
    component: "input",
    type: "text",
    name: "country",
    placeholder: "Entrez votre pays",
    value: "France",
    schema: z.object({
      country: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le pays doit contenir au moins 2 caractères" }).max(50, { message: "Le pays doit contenir au maximum 50 caractères" }),
    }),
    col: 2,
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
          .max(32, { message: "Le mot de passe doit contenir au maximum 32 caractères" })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
    }),
    col: 2,
  },
]

function handleUserInfo(res: Response) {
  res.json().then((data) => {
    if(!data.user) {
      notificationStore.add({
        message: "Impossible de récupérer les données de l'utilisateur.",
        type: "error",
        timeout: 3000
      });
      return;
    }
    const {id, firstname, lastname, email, phone, birthdate, address, zipcode, city, country} = data.user;
    user.value = {id, firstname, lastname, email, phone, birthdate, address, zipcode, city, country};
    formRef.value?.SetFieldValue({firstname: user.value.firstname}, "firstname");
    formRef.value?.SetFieldValue({lastname: user.value.lastname}, "lastname");
    formRef.value?.SetFieldValue({email: user.value.email}, "email");
    formRef.value?.SetFieldValue({phone: user.value.phone}, "phone");
    formRef.value?.SetFieldValue({birthdate: user.value.birthdate}, "birthdate");
    formRef.value?.SetFieldValue({address: user.value.address}, "address");
    formRef.value?.SetFieldValue({zipcode: user.value.zipcode}, "zipcode");
    formRef.value?.SetFieldValue({city: user.value.city}, "city");
    formRef.value?.SetFieldValue({country: user.value.country}, "country");
  });
}
async function handleSave() {
  if(user.value === undefined) {
    notificationStore.add({
      message: "Impossible de sauvegarder les données de l'utilisateur.",
      type: "error",
      timeout: 3000
    });
    return;
  }
 await updateUser(userStore.user.id, formRef.value?.getFieldsValue(), handleSaveResponse);
}
function handleSaveResponse(res: Response) {
  if(res.status === 204) {
    notificationStore.add({
      message: "Les données de l'utilisateur ont été sauvegardées.",
      type: "success",
      timeout: 3000
    });
    isDisabled.value = true;
  } else if(res.status === 401) {
    notificationStore.add({
      message: "Le mot de passe est incorrect.",
      type: "error",
      timeout: 3000
    });
  }
  else {
    notificationStore.add({
      message: "Impossible de sauvegarder les données de l'utilisateur.",
      type: "error",
      timeout: 3000
    });
  }
}
</script>