<template>
  <div>
      <h1>Utilisateurs:</h1>
      <CustomizableTable
          :data="data.datas"
          :columns="data.columns"
          :actions="data.actions"
          :numberOfItemsPerPage="data.numberOfItemsPerPage"
          :canDeleteAll="false"
          @visualize-item="handleVisualize"
          @edit-item="handleEdit"
          @create-item="handleCreate"
          @delete-item="handleDelete"
          @delete-multiple-items="handleDeleteMultiple"
      ></CustomizableTable>

      <visualizer
        class="mt-4"
        v-if="userVisualizer != undefined"
        :title="'Utilisateur'"
        :data="userVisualizer"
        :buttons="['close']"
        :fields="['email', 'firstname', 'lastname', 'phone', 'address','city', 'country', 'birthdate', 'is_verified', 'role']"
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
        }"        
        :valueTransforms="{ password: '******' }"
        @closeVisualizer="onCloseVisualizer"
      ></visualizer>

      <ModalForm v-if="showModalEdit" :title="'Modification d\'un utilisateur'" :formSchema="formSchemaEditUser" :data="dataEdit" @close="showModalEdit=false" @submit="handleSaveEdit"/>

      <Dialog v-model:open="isCreateModalVisible">
          <UserCreateModal
            :errors="errors"
            @close="onCloseCreate"
            @save="createItem"
          />
      </Dialog>
      <confirm-modal
          v-if="openModal"
          :data="selectedItem"
          :title="'Confirmer la suppression de ' + selectedItem?.email + ' ?'"
          size="sm"
          @confirm="openModal = false"
          @close="openModal = false"
          :action="deleteItem"
      >
      </confirm-modal>
      <confirm-modal
          v-if="openModalMultiple"
          :data="selectedItems"
          :title="'Confirmer la suppression de ' + selectedItems?.length + ' utilisateurs ?'"
          size="sm"
          @confirm="openModalMultiple = false"
          @close="openModalMultiple = false"
          :action="deleteItems"
      >
      </confirm-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, Ref } from 'vue';
import CustomizableTable from '@/components/common/custom-table/customizable-table.vue';
import { UserService } from '@/composables/api/user.service.ts';
import { User } from '@/dto/user.dto';
import ModalForm from '@/components/common/modaleForm.vue';
import UserCreateModal from '@/pages/admin/users/userCreateModale.vue';
import { Dialog } from '@/components/ui/dialog'; 
import ConfirmModal from '@/components/ConfirmModal.vue';
import visualizer from '@/components/common/visualizer.vue';
import {useRouter} from "vue-router";
import {useNotificationStore} from "@/stores/notification.ts";
import { z  } from "zod";
import { formMessages } from "@/composables/formMessages.ts";
import { FormField } from "@/dto/formField.dto.ts";

const { getUsers, updateUser, deleteUser, deleteBatchUsers, createUser } = UserService();
const { requiredMessage, invalidStringMessage, invalidDateMessage } = formMessages();

const router = useRouter();
const notificationStore = useNotificationStore();

const openModal = ref<boolean>(false);
const openModalMultiple = ref<boolean>(false);

const datas = ref<User[]>([]);
const userVisualizer: Ref<User | undefined> = ref<User>();

const showModalEdit = ref(false);
const isCreateModalVisible = ref(false);
const selectedItem = ref<User | null>(null);
const selectedItems = ref<User[] | null>(null);

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

const refreshUsers = async () => {
  await getUsers((datas: []) => datas).then((res:Response) => {
    if(res.status === 200) {
      res.json().then(data => {
        datas.value = data.users
      });
    } else {
      router.push({ path: '/403'});
    }
  });
}

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


function handleVisualize(item: User) {
  userVisualizer.value = item;
}

function handleEdit(item: User) {
  selectedItem.value = item;

  dataEdit.value = [
    { lastname: item.lastname },
    { firstname: item.firstname },
    { birthdate: item.birthdate },
  ];
  showModalEdit.value = true;
}

async function handleSaveEdit(newDataForUpdate: Record<string, any>) {
  console.log(newDataForUpdate);
  const userId = selectedItem.value?.id;
  if(!userId) {
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

  
function handleDelete(item: User) {
  selectedItem.value = item
  openModal.value = true
}

function handleCreate() {
  isCreateModalVisible.value = true
}

function handleDeleteMultiple(items: User[]) {
  selectedItems.value = items
  openModalMultiple.value = true
}

function deleteItem(item: User) {
  deleteUser(item.id)
  .then(() => refreshUsers())
  .catch(() => {
      notificationStore.add({
          message: 'Impossible de supprimer un administrateur',
          timeout: 3000,
          type: 'error'
      });
  });
  openModal.value = false
}

function onCloseCreate() {
  isCreateModalVisible.value = false
  refreshUsers()
}

function createItem(item: User) {
  errors.value = {};
  createUser(item)
  .then(() => {
    refreshUsers();
    isCreateModalVisible.value = false
  })
  .catch(error => {
    const parsedErrors = JSON.parse(error);
    if (parsedErrors.errors && Array.isArray(parsedErrors.errors)) {
      parsedErrors.errors.forEach((errItem: { path: string[], message: string }) => {
        if (errItem.path && errItem.path.length > 0) {
          const key = errItem.path[0];
          errors.value[key] = errItem.message;
        }
      });
    } else {
      console.error('Unexpected error format:', parsedErrors);
    }
  });
}

function deleteItems(items: User[]) {
  deleteBatchUsers(items)
    .then(() => {
      refreshUsers();
      openModalMultiple.value = false;
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

function onCloseVisualizer() {
    userVisualizer.value = undefined;
  }

onMounted(() => {
  refreshUsers();
});
</script>
