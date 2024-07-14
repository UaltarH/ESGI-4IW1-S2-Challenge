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
  import ProductEditModale from '@/pages/admin/products/productsEditModale.vue';
  import { Dialog } from '@/components/ui/dialog'; 
  
  const { getAllMongoProducts, updateMongoProduct, deleteProduct, deleteMultiplesProducts } = ProductService();
  
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
  
  function handleVisualize(item: mongoProduct) {
    window.location.href = `/admin/products/${item._id}`;
  }
  
  function handleEdit(item: mongoProduct) {
    const itemCopy = { ...item } as Partial<typeof item>;
    delete itemCopy.createdAt;
    delete itemCopy.updatedAt;
    delete itemCopy.deleteAt;
    selectedItem.value = { ...itemCopy };
    isModalVisible.value = true;
  }
  
  function handleSave(item: mongoProduct) {
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
  
  function handleDelete(item: mongoProduct) {
    deleteProduct(item.postgresId).then(() => refreshProducts())
  }

  function handleMultipleDelete(items: mongoProduct[]) {
    deleteMultiplesProducts(items.map(item => item.postgresId).join(','))
    .then(() => {
      refreshProducts();
    })
  }

  onMounted(() => {
    refreshProducts();
  });
</script>
  