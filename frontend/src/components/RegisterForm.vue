<template>
  <section class="py-24 mx-12 mb-12">
    <Form ref="formRef" :schema="formSchema" @submit="handleSubmit" :disabled="formDisabled" :loading="formLoading"
      :show-reset="true" >
      <template #footer>
        <div class="relative w-[390px]">
          <Collapsible v-model:open="isOpenCollaps" class="border border-gray-200 rounded-lg absolute right-0 md:right-[34%] w-full sm:w-80 md:w-64 bg-white ">
            <div class="flex items-center justify-between space-x-4 px-4">
              <h4 class="text-sm font-semibold">
                Notifications
              </h4>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                  <ChevronsUpDown class="h-4 w-4" />
                  <span class="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent class="w-full ">
              <div class="space-y-4 p-4">
                <p class="text-sm text-gray-500 mb-4">
                  Ces notifications seront envoyées par e-mail et seront également visibles sur notre site.
                </p>
                <div v-for="(pref, key) in userPreferences" :key="key" class="flex items-center justify-between">
                  <label :for="key" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {{ pref.label }}
                  </label>
                  <Switch v-model:checked="pref.value" :id="key" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

        </div>
      </template>
    </Form>
  </section>
</template>
<script lang="ts" setup>
import Form from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { onUnmounted, Ref, ref, watch, reactive } from "vue";
import { z } from "zod";
import { useAuth } from "@/composables/api/useAuth.ts";
import { formMessages } from "@/composables/formMessages";
import { useNotificationStore } from "@/stores/notification.ts";
import { useRouter } from "vue-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { ChevronsUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

onUnmounted(() => {
  controller.abort();
});

const router = useRouter();
const controller = new AbortController();
const { signal } = controller;
const { registerUser } = useAuth();
const { requiredMessage, invalidStringMessage, invalidDateMessage } = formMessages();
const notificationStore = useNotificationStore();

const emits = defineEmits(['close']);

const props = defineProps<{ 
  isForAdmin?: boolean, 
}>();

const item = reactive({
  value: props.isForAdmin ?? false 
});

watch(() => props.isForAdmin, (newVal) => {
  item.value = newVal ?? false; 
}, { immediate: true });

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);

//user pref
const isOpenCollaps = ref(false)
const userPreferences = reactive({
  newProduct: { label: "Ajout d'un nouveau produit", value: true },
  priceChange: { label: "Modification du prix d'un produit", value: true },
  restockProduct: { label: "Nouveau stock pour un produit", value: true }
});

const formRef = ref<{ formRef: Ref<any>, SetFieldValue: Function, getFieldsValue: Function, handleReset: Function } | null>(null);
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
    col: 1,
  },
]);
const formLoading = ref(false);
const formDisabled = ref(false);

async function handleSubmit(schema: FormField<any>[]) {
  // build param
  let param: { [key: string]: string | number | Date } = {};
  schema.forEach((item) => {
    if (item.value !== undefined)
      param[item.name] = item.value;
  });
  param.role = "user";
  formLoading.value = true;
  formDisabled.value = true;
  await fetchRegister(param);
}

const fetchRegister = async (param: { [key: string]: string | number | Date }) => {
  let body = { 
    ...param, 
    ...Object.fromEntries(Object.entries(userPreferences).map(([key, value]) => [key, value.value]))
  };  
  await registerUser(body, signal, handleRegister);
}

function handleRegister(res: Response) {
  if (res.status === 201) {
    console.log("User registered");
    formLoading.value = false;
    notificationStore.add({ message: 'Inscription réussie, un email de vérification vient de vous être envoyé', timeout: 3000, type: 'success' });
    // Ignore the warning :  formRef.value will hold an instance of <CustomForm> after the form is mounted (cf: template refs doc)
    if (formRef.value !== null) {
      formRef.value.handleReset();
    }
    if (item.value) {
      emits('close');
    } else {
      setTimeout(() => {
        router.push({ name: 'home' });
      }, 3000);
    }
  } else if (res.status === 409) {
    setTimeout(() => {
      console.error(res.statusText);
      formLoading.value = false;
      formDisabled.value = false;
      notificationStore.add({ message: 'L\'adresse mail est déjà utilisée', timeout: 3000, type: 'error' });
    }, 3000);
  } else {
    setTimeout(() => {
      console.error(res.statusText);
      formLoading.value = false;
      formDisabled.value = false;
      notificationStore.add({ message: 'Erreur lors de l\'inscription', timeout: 3000, type: 'error' });
    }, 3000);
  }
}
</script>