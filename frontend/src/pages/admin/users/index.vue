<template>
  <div>
    <h1>Utilisateurs:</h1>
    <CustomizableTable :data="data.datas" :columns="data.columns" :actions="data.actions"
      :numberOfItemsPerPage="data.numberOfItemsPerPage" :canDeleteAll="false" @visualize-item="handleVisualize"
      @edit-item="handleEdit" @create-item="handleCreate" @delete-item="handleDelete"
      @delete-multiple-items="handleDeleteMultiple"></CustomizableTable>

    <visualizer class="mt-4" v-if="userVisualizer != undefined" :title="'Utilisateur'" :data="userVisualizer"
      :buttons="['close']"
      :fields="['email', 'firstname', 'lastname', 'phone', 'address', 'city', 'country', 'birthdate', 'is_verified', 'role']"
      :labels="{
      phone: 'Numéro de Téléphone',
      address: 'Adresse',
      birthdate: 'Date de Naissance',
      city: 'Ville',
      country: 'Pays',
      email: 'Adresse Email',
      firstname: 'Prénom',
      lastname: 'Nom de Famille',
      is_verified: 'Vérifié',
      role: 'Rôle'
    }" @closeVisualizer="userVisualizer = undefined">
    </visualizer>

    <ModalForm v-if="showModalEdit" :title="'Modification d\'un utilisateur'" :formSchema="formSchemaEditUser"
      :data="dataEdit" @close="showModalEdit = false" @submit="editUser" />

    <ModalForm v-if="showModalCreat" :title="'Ajout d\'un utilisateur'" :formSchema="formSchemaAdminCreateUser" :size="'lg'"
      @close=" showModalCreat=false" @submit=" createUserFunc ">
      <template #footerModal>
        <Collapsible v-model:open="isOpenCollaps" class="border border-gray-200 rounded-lg right-0 md:right-[34%] w-full sm:w-80 md:w-64 bg-white ">
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
      </template>
    </ModalForm>

    <confirm-modal
        v-if="openModal"
        :data="selectedUser"
        :title="'Confirmer la suppression de ' + selectedUser?.email + ' ?'"
        size="sm"
        @confirm="openModal = false"
        @close="openModal = false"
        :action="deleteItem"
    >
    </confirm-modal>
    <confirm-modal
        v-if="openModalMultiple"
        :data="selectedUsers"
        :title="'Confirmer la suppression de ' + selectedUsers?.length + ' utilisateurs ?'"
        size="sm"
        @confirm="openModalMultiple = false"
        @close="openModalMultiple = false"
        :action="deleteItems"
        >
    </confirm-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { reactive, ref, onMounted, Ref } from 'vue';
import CustomizableTable from '@/components/common/custom-table/customizable-table.vue';
import { UserService } from '@/composables/api/user.service.ts';
import { User } from '@/dto/user.dto';
import ModalForm from '@/components/common/modaleForm.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import visualizer from '@/components/common/visualizer.vue';
import { useNotificationStore } from "@/stores/notification.ts";
import { z } from "zod";
import { formMessages } from "@/composables/formMessages.ts";
import { FormField } from "@/dto/formField.dto.ts";
import { Switch } from '@/components/ui/switch';
import { ChevronsUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { getUsers, updateUser, deleteUser, deleteBatchUsers, createUser } = UserService();
const { requiredMessage, invalidStringMessage, invalidDateMessage } = formMessages();
const notificationStore = useNotificationStore();

const openModal = ref(false);
const openModalMultiple = ref(false);
const showModalEdit = ref(false);
const showModalCreat = ref(false);
const isOpenCollaps = ref(false)

const userPreferences = reactive({
  newProduct: { label: "Ajout d'un nouveau produit", value: true },
  priceChange: { label: "Modification du prix d'un produit", value: true },
  restockProduct: { label: "Nouveau stock pour un produit", value: true }
});


const datas = ref<User[]>([]);
const userVisualizer: Ref<User | undefined> = ref<User>();
const selectedUser = ref<User | undefined>();
const selectedUsers = ref<User[] | undefined>();

const dataEdit: Ref<Array<{ [key: string]: any }>> = ref([]);
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 120));
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
const formSchemaEditUser: FormField[] = [
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
    disabled: false,
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
    disabled: false,
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
    disabled: false,
  },
];
const formSchemaAdminCreateUser: FormField[] = [
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
  {
    label: "Rôle",
    component: "select",
    type: "select",
    name: "role",
    placeholder: "Choisissez le role",
    schema: z.object({
        role: z.enum(["user", "admin", "placeholder"], {
            required_error: requiredMessage,
            invalid_type_error: "Veuillez choisir un role valide"
        }).refine(value => value !== "placeholder", {
            message: "Veuillez choisir un rôle valide"
        })
    }),
    col: 2,
    optionsSelect: [
        { value: "user", label: "Utilisateur" },
        { value: "admin", label: "Administrateur" },
    ],
    value: "placeholder",
  },
  {
    label: "Compte confirmé",
    component: "input",
    type: "checkbox",
    name: "is_verified",
    schema: z.object({
      is_verified: z.boolean({ required_error: requiredMessage, invalid_type_error: "Veuillez cocher la case pour confirmer le compte" })
    }),
    col: 2,
    placeholder: "Compte confirmé",
    value: true,
    disabled: true,
  }
]

const data = reactive({
  datas: datas,
  columns: [
    { name: 'Email', key: 'email', sort: true, typeData: 'string' },
    { name: 'Rôle', key: 'role', sort: true, typeData: 'string' },
    { name: 'Vérifié', key: 'is_verified', sort: true, typeData: 'boolean' },
  ],
  actions: { edit: true, delete: true, visualize: true },
  numberOfItemsPerPage: [5, 10, 15, 20],
});

onMounted(() => {
  refreshUsers();
});

const refreshUsers = async () => {
  await getUsers((datas: []) => datas).then((res: Response) => {
    if (res.status === 200) {
      res.json().then(data => {
        datas.value = data.users
      });
      selectedUser.value = undefined;
      userVisualizer.value = undefined;
    }
  });
}

function handleVisualize(item: User) {
  userVisualizer.value = item;
}

function handleEdit(item: User) {
  selectedUser.value = item;

  dataEdit.value = [
    { lastname: item.lastname },
    { firstname: item.firstname },
    { birthdate: item.birthdate },
  ];
  showModalEdit.value = true;
}

function handleDelete(item: User) {
  selectedUser.value = item
  openModal.value = true
}

function handleDeleteMultiple(items: User[]) {
  selectedUsers.value = items
  openModalMultiple.value = true
}

function handleCreate() {
  showModalCreat.value = true
}

async function editUser(newDataForUpdate: Record<string, any>) {
  const userId = selectedUser.value?.id;
  if (!userId) {
    return;
  }
  try {
    await new Promise((resolve, reject) => {
      updateUser(userId, newDataForUpdate, (res: Response) => {
        if (res.status === 204) {
          resolve(res);
        } else {
          reject(new Error(`Erreur HTTP: ${res.status}`));
        }
      });
    });

    notificationStore.add({
      message: "Les données de l'utilisateur ont été sauvegardées.",
      type: "success",
      timeout: 3000
    });

    await refreshUsers();
    showModalEdit.value = false;

  } catch (error) {
    notificationStore.add({
      message: "Impossible de sauvegarder les données de l'utilisateur.",
      type: "error",
      timeout: 3000
    });
  }
}

function deleteItem(item: User) {
  deleteUser(item.id)
  .then(() => {
    refreshUsers(),
    notificationStore.add({
        message: 'L\'utilisateur a été supprimé',
        timeout: 3000,
        type: 'success'
    })
  })
  .catch(() => {
      notificationStore.add({
          message: 'Impossible de supprimer un administrateur',
          timeout: 3000,
          type: 'error'
      });
  });
  openModal.value = false
}

function deleteItems(items: User[]) {
  deleteBatchUsers(items)
    .then(() => {
      refreshUsers();
      openModalMultiple.value = false;
      notificationStore.add({
        message: 'Les utilisateurs ont été supprimés',
        timeout: 3000,
        type: 'success'
      });
    })
    .catch(() => {
      notificationStore.add({
        message: 'Impossible de supprimer un administrateur',
        timeout: 3000,
        type: 'error'
      });
      openModalMultiple.value = false;
    });
}

async function createUserFunc(item: User) {
  let body = { 
    ...item, 
    ...Object.fromEntries(Object.entries(userPreferences).map(([key, value]) => [key, value.value]))
  };  
  try {
    await createUser(body);
    notificationStore.add({
      message: 'L\'utilisateur a été créé',
      timeout: 3000,
      type: 'success'
    });
    showModalCreat.value = false;
    refreshUsers();
    
  } catch (error) {
    notificationStore.add({
      message: 'Impossible de créer l\'utilisateur',
      timeout: 3000,
      type: 'error'
    });
  }
}
</script>
