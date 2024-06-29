<template>
  <div class="py-24">
    <Form ref="formRef" :schema="formSchema" @submit="handleSubmit" :disabled="formDisabled" :loading="formLoading" :show-reset="true"/>
  </div>
</template>
<script lang="ts" setup>
import Form from "@/components/CustomForm.vue";
import { FormField} from "@/dto/formField.dto.ts";
import { useAuth} from "@/composables/useAuth";
import { ApiResponse} from "@/dto/apiResponse.dto.ts";
import { z } from "zod";
import { onUnmounted, Ref, ref  } from "vue";

const controller = new AbortController();
const { signal } = controller;
const { registerUser } = useAuth();

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);

const requiredMessage = "Ce champ est requis";
const invalidStringMessage = "Ce champ doit être une chaîne de caractères";
const invalidNumberMessage = "Ce champ doit être un nombre";
const invalidEmailMessage = "Ce champ doit être une adresse email valide";
const invalidDateMessage = "Ce champ doit être une date valide";

const formRef = ref<{formRef:Ref<any>, SetFieldsValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null);
const formSchema = ref<FormField<any>[]>([
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
    col: 2,
    dependsOn: { field: "password", errorMessage: "Les mots de passe ne correspondent pas" },
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
      zipcode: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
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
    col: 0,
  },
]);
const formLoading = ref(false);
const formDisabled = ref(false);

onUnmounted(() => {
  controller.abort();
});

async function handleSubmit(schema: FormField<any>[]) {
  console.log("Form submitted");
  console.log(schema);
  // build param
  let param: { [key: string]: string | number | Date } = {};
  schema.forEach((item) => {
    if (item.value !== undefined)
      param[item.name] = item.value;
  });
  formLoading.value = true;
  formDisabled.value = true;
  setTimeout(async () => {
    await fetchRegister(param);
  }, 5000);
}
const fetchRegister = async (param: { [key: string]: string | number | Date }) => {
  await registerUser(param, signal, handleRegister);
}
function handleRegister(res: Response) {
  if(res.status === 201) {
    console.log("User registered");
    formLoading.value = false;
    formDisabled.value = false;
    res.json().then((data: ApiResponse) => {
      console.group("Response")
      console.log(data);
      console.groupEnd();
      console.group("formRef");
      console.log(formRef.value);
      console.log(formRef.value.getFieldsValue());
      console.groupEnd();
      // Ignore the warning :  formRef.value will hold an instance of <CustomForm> after the form is mounted (cf: template refs doc)
      if(formRef.value !== null) {
        // TODO : popup success with setTimeout
        // TODO : reset or unmount form
        formRef.value.handleReset();
        // @reset event is triggered by handleReset
        // TODO : redirect to login
      }
      // exemple on how to use SetFieldValue
      // formRef.value.SetFieldValue({country: "ESGI"}, "country");
    });
  } else {
    console.error(res.statusText);
  }
}
</script>