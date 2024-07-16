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
          @delete-multiple-items="handleMultipleDelete"
      ></CustomizableTable>

      <visualizer class="mt-4" v-if="userVisualizer != undefined" :title="'Produit'" :data="userVisualizer" :buttons="['close']" @closeVisualizer="onCloseVisualizer"></visualizer>

    <Dialog v-model:open="isModalVisible">
        <GenericEditModal
          :model="selectedItem"
          @close="isModalVisible = false"
          @save="handleSave"
        />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, Ref } from 'vue';
import CustomizableTable from '@/components/common/custom-table/customizable-table.vue';
import { useUserManagement } from '@/composables/api/useUserManagement';
import { User } from '@/dto/user.dto';
import GenericEditModal from '@/components/common/editModale/genericEditModale.vue';
import { Dialog } from '@/components/ui/dialog'; 
import visualizer from '@/components/common/visualizer.vue';


const { getUsers, updateUser, deleteUser, deleteMultiplesUsers } = useUserManagement();

const datas = ref<User[]>([]);
const userVisualizer: Ref<User | undefined> = ref<User>();

const refreshUsers = () => {
  getUsers((datas: []) => datas).then(res => datas.value = res.users);
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
const selectedItem = ref<Record<string, any> | null>(null);

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

function handleSave(item: User) {
  const itemCopy = { ...item } as Partial<typeof item>;
  delete itemCopy.id;
  const itemCopyWithStringValues = convertValuesToStrings(itemCopy);

  updateUser(item.id, data => {
    refreshUsers();
  }, itemCopyWithStringValues).catch(error => {
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
  deleteUser(item.id);
  refreshUsers();
}

function handleMultipleDelete(items: User[]) {
  deleteMultiplesUsers(items.map(item => item.id).join(','))
  .then(() => {
    refreshUsers();
  })
}

function onCloseVisualizer() {
    userVisualizer.value = undefined;
  }

onMounted(() => {
  refreshUsers();
});
</script>
