<template>
    <div>
        <h1>Produits:</h1>
        <CustomizableTable
            :data="data.datas"
            :columns="data.columns"
            :actions="data.actions"
            :numberOfItemsPerPage="data.numberOfItemsPerPage"
            :canDeleteAll="false"
            @visualize-item="handleVisualize"
            @edit-item="handleEdit"
            @delete-item="handleDelete"
            @delete-multiple-items="handleDeleMultiple"
        ></CustomizableTable>

        <visualizer class="mt-4" v-if="productVisualizer != undefined" :title="'Produit'" :data="productVisualizer" :buttons="['close']" @closeVisualizer="onCloseVisualizer"></visualizer>
  
      <Dialog v-model:open="isModalVisible">
          <ProductEditModale
            :model="selectedItem"
            @close="isModalVisible = false"
            @save="handleSave"
          />
      </Dialog>
      <confirm-modal
          v-if="openModal"
          :data="selectedItem"
          :title="'Confirmer la suppression de ' + selectedItem?.name + ' ?'"
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
  import { ProductService } from '@/composables/api/products.service.ts';
  import { mongoProduct } from '@/dto/MongoProduct.dto';
  import ProductEditModale from '@/pages/admin/products/productsEditModale.vue';
  import { Dialog } from '@/components/ui/dialog'; 
  import ConfirmModal from '@/components/ConfirmModal.vue';
  import visualizer from '@/components/common/visualizer.vue';
  
  const { getAllMongoProducts, updateMongoProduct, deleteProduct, deleteMultiplesProducts } = ProductService();
  
  const openModal = ref<boolean>(false);
  const openModalMultiple = ref<boolean>(false);

  const productVisualizer: Ref<mongoProduct | undefined> = ref<mongoProduct>();

  const datas = ref<mongoProduct[]>([]);
  const refreshProducts = () => {
    getAllMongoProducts(datas => datas).then(res => datas.value = res.products);
  }
  
  const data = reactive({
    datas: datas,
    columns: [
      { name: 'ID', key: 'postgresId', sort: true, typeData: 'string' },
      { name: 'Nom', key: 'name', sort: true, typeData: 'string' },
      { name: 'Quantité', key: 'categoryName', sort: false, typeData: 'string' },
    ],
    actions: { edit: true, delete: true, visualize: true },
    numberOfItemsPerPage: [5, 10, 15, 20],
  });
  
  const isModalVisible = ref(false);
  const selectedItem = ref<mongoProduct | null>(null);
  const selectedItems = ref<mongoProduct[] | null>(null);
  
  function handleVisualize(item: mongoProduct) {
    productVisualizer.value = item;
  }
  
  function handleEdit(item: mongoProduct) {
    const itemCopy = { ...item } as Partial<typeof item>;
    delete itemCopy.createdAt;
    delete itemCopy.updatedAt;
    selectedItem.value = { ...itemCopy };
    isModalVisible.value = true;
  }
  
  function handleSave(item: mongoProduct) {
    const itemCopy = { ...item };
    const itemCopyWithStringValues = convertValuesToStrings(itemCopy);

    updateMongoProduct(item.postgresId, itemCopyWithStringValues)
    .then(() => refreshProducts())
    .catch(error => {
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
  
  function handleDelete(item: mongoProduct) {
    selectedItem.value = item
    openModal.value = true
  }
  
  function handleDeleMultiple(items: mongoProduct[]) {
    selectedItems.value = items
    openModalMultiple.value = true
  }
  
  function deleteItem(item: mongoProduct) {
    deleteProduct(item.postgresId).then(() => refreshProducts())
    openModal.value = false
  }

  function deleteItems(items: mongoProduct[]) {
    deleteMultiplesProducts(items.map(item => item.postgresId).join(','))
    .then(() => {
      refreshProducts();
    })
    openModalMultiple.value = false
  }

  function onCloseVisualizer() {
    productVisualizer.value = undefined;
  }

  onMounted(() => {
    refreshProducts();
  });
</script>
  