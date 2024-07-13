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
  
      <Dialog v-model:open="isModalVisible">
          <ProductEditModale
            :model="selectedItem"
            @close="isModalVisible = false"
            @save="handleSave"
          />
      </Dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import CustomizableTable from '@/components/common/custom-table/customizable-table.vue';
  import { ProductService } from '@/composables/api/products.service.ts';
  import { mongoProduct } from '@/dto/MongoProduct.dto';
  import ProductEditModale from '@/components/common/editModale/productsEditModale.vue';
  import { Dialog } from '@/components/ui/dialog'; 
  
  const { getAllMongoProducts, updateMongoProduct, deleteProduct } = ProductService();
  
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
  const selectedItem = ref<Record<string, any> | null>(null);
  
  function handleVisualize(item: any) {
    window.location.href = `/admin/products/${item._id}`;
  }
  
  function handleEdit(item: any) {
    const itemCopy = { ...item };
    delete itemCopy.createdAt;
    delete itemCopy.updatedAt;
    delete itemCopy.deleteAt;
    selectedItem.value = { ...itemCopy };
    isModalVisible.value = true;
  }
  
  function handleSave(item: Record<string, any>) {
    const itemCopy = { ...item };
    const itemCopyWithStringValues = convertValuesToStrings(itemCopy);

    updateMongoProduct(item._id, itemCopyWithStringValues)
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
  
  function handleDelete(item: any) {
    deleteProduct(item._id).then(() => refreshProducts())
  }

  function handleMultipleDelete(items: any[]) {
    Promise.all(items.map(item => {
      if (item && item._id) {
        return deleteProduct(item._id);
      } else {
        console.error('Item does not have an ID');
        return Promise.reject('Item ID is missing');
      }
    }))
    .then(() => {
      refreshProducts();  
    })
    .catch(error => {
      console.error('Error deleting multiple items:', error);
    });
  }

    onMounted(() => {
      refreshProducts();
    });
  </script>
  