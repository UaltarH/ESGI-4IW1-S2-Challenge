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
          @delete-item="handleDelete"
          @delete-multiple-items="handleDeleteMultiple"
      ></CustomizableTable>

      <visualizer
        class="mt-4"
        v-if="userVisualizer != undefined"
        :title="'Produit'"
        :data="userVisualizer"
        :buttons="['close']"
        :fields="['id', 'phone', 'password', 'address', 'birthdate', 'city', 'country', 'email', 'fistname', 'lastname', 'role']"
        :labels="{ email: 'Adresse Email', phone: 'Numéro de Téléphone' }"
        :valueTransforms="{ password: '******' }"
        @closeVisualizer="onCloseVisualizer"
      ></visualizer>

      <Dialog v-model:open="isModalVisible">
          <GenericEditModal
            :model="selectedItem"
            @close="isModalVisible = false"
            @save="handleSave"
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
import GenericEditModal from '@/components/common/editModale/genericEditModale.vue';
import { Dialog } from '@/components/ui/dialog'; 
import ConfirmModal from '@/components/ConfirmModal.vue';
import visualizer from '@/components/common/visualizer.vue';
import {useRouter} from "vue-router";
import {useNotificationStore} from "@/stores/notification.ts";

const { getUsers, updateUser, deleteUser, deleteBatchUsers } = UserService();

const router = useRouter();
const notificationStore = useNotificationStore();

const openModal = ref<boolean>(false);
const openModalMultiple = ref<boolean>(false);

const datas = ref<User[]>([]);
const userVisualizer: Ref<User | undefined> = ref<User>();

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
    { name: 'ID', key: 'id', sort: true, typeData: 'string' },
    { name: 'Email', key: 'email', sort: true, typeData: 'string' },
    { name: 'Téléphone', key: 'phone', sort: false, typeData: 'string' },
  ],
  actions: { edit: true, delete: true, visualize: true },
  numberOfItemsPerPage: [5, 10, 15, 20],
});

const isModalVisible = ref(false);
const selectedItem = ref<User | null>(null);
const selectedItems = ref<User[] | null>(null);

function handleVisualize(item: User) {
  userVisualizer.value = item;
}

function handleEdit(item: User) {
  const itemCopy = { ...item } as Partial<typeof item>;
  delete itemCopy.createdAt;
  delete itemCopy.updatedAt;  
  selectedItem.value = { ...itemCopy };
  isModalVisible.value = true;
}

async function handleSave(item: User) {
  const itemCopy = {...item} as Partial<typeof item>;
  delete itemCopy.id;
  const itemCopyWithStringValues = convertValuesToStrings(itemCopy);

  await updateUser(item.id, itemCopyWithStringValues, (res:Response) => {
    if(res.status === 204) {
      refreshUsers();
      notificationStore.add({
        message: "Les données de l'utilisateur ont été sauvegardées.",
        type: "success",
        timeout: 3000
      });
    } else if(res.status === 401) {
      notificationStore.add({
        message: "Not authorized",
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
  }).catch(error => {
    console.error('Error in handleSave:', error);
  });
}

  const convertValuesToStrings = (obj: Record<string, any>): Record<string, string> => {
      const result: Record<string, string> = {};
      for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
              result[key] = String(obj[key]);
          }
      }
      return result;
  };
  
function handleDelete(item: User) {
  selectedItem.value = item
  openModal.value = true
}

function handleDeleteMultiple(items: User[]) {
  selectedItems.value = items
  openModalMultiple.value = true
}

function deleteItem(item: User) {
  deleteUser(item.id).then(() => refreshUsers())
  openModal.value = false
}

function deleteItems(items: User[]) {
  deleteBatchUsers(items.map(item => item.id).join(','))
  .then(() => {
    refreshUsers();
  })
  openModalMultiple.value = false
}

function onCloseVisualizer() {
    userVisualizer.value = undefined;
  }

onMounted(() => {
  refreshUsers();
});
</script>
