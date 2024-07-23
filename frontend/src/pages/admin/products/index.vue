<template>
  <div>
    <h1>Produits:</h1>
    <CustomizableTable :data="data.datas" :columns="data.columns" :actions="data.actions"
      :numberOfItemsPerPage="data.numberOfItemsPerPage" :canDeleteAll="false" @visualize-item="handleVisualize"
      @edit-item="handleEdit" @create-item="handleCreate" @delete-item="handleDelete"
      @delete-multiple-items="handleDeleteMultiple"></CustomizableTable>

    <visualizer class="mt-4" v-if="productVisualizer != undefined" :title="'Produit'" :data="productVisualizer"
      :buttons="['close']" :fields="[
      'name',
      'description',
      'price',
      'stock',
      'threshold',
      'imagePath',
      'categoryName',
    ]" :labels="{
      name: 'Nom',
      description: 'Description',
      price: 'Prix',
      stock: 'Stock',
      threshold: 'Seuil',
      imagePath: 'Image',
      categoryName: 'Nom de la Catégorie',
    }" @closeVisualizer="productVisualizer = undefined;"></visualizer>

    <ModalForm v-if="showModalEdit" :title="'Modification d\'un produit'" :formSchema="formSchemaEditProduct"
      :data="dataEdit" @close="showModalEdit = false" @submit="updateProductFunc" />
    
    <ModalForm v-if="showModalAdd" :title="'Création d\'un produit'" :formSchema="formSchemaAddProduct"
     @close="showModalAdd = false" @submit="createProductFunc" />

    <confirm-modal v-if="openModal" :data="selectedItem"
      :title="'Confirmer la suppression de ' + selectedItem?.name + ' ?'" size="sm" @confirm="openModal = false"
      @close="openModal = false" :action="deleteItem">
    </confirm-modal>
    <confirm-modal v-if="openModalMultiple" :data="selectedItems"
      :title="'Confirmer la suppression de ' + selectedItems?.length + ' produits ?'" size="sm"
      @confirm="openModalMultiple = false" @close="openModalMultiple = false" :action="deleteItems">
    </confirm-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, Ref, computed } from 'vue';
import CustomizableTable from '@/components/common/custom-table/customizable-table.vue';
import { ProductService } from '@/composables/api/products.service.ts';
import { mongoProduct } from '@/dto/MongoProduct.dto';
import ConfirmModal from '@/components/ConfirmModal.vue';
import visualizer from '@/components/common/visualizer.vue';
import { Category } from '@/dto/category.dto';
import { CategoriesService } from "@/composables/api/categories.service";
import { FormField } from '@/dto/formField.dto';
import { z } from "zod";
import { formMessages } from "@/composables/formMessages.ts";
import { useNotificationStore } from "@/stores/notification.ts";
import ModalForm from '@/components/common/modaleForm.vue';
import { createProduct as createProductDto } from '@/dto/api/product.dto';

const notificationStore = useNotificationStore();
const { getAllMongoProducts, updateProduct, deleteProduct, deleteMultiplesProducts, createProduct } = ProductService();
const { getCategories } = CategoriesService();
const { requiredMessage, invalidStringMessage } = formMessages();

const openModal = ref<boolean>(false);
const openModalMultiple = ref<boolean>(false);
const showModalEdit = ref(false);
const showModalAdd = ref(false);

const productVisualizer: Ref<mongoProduct | undefined> = ref<mongoProduct>();

const categories = ref<Category[]>([]);
const categoriesSchema = computed(() => 
  categories.value.map(category => ({ value: category.id, label: category.name }))
);

const selectedItem = ref<mongoProduct | null>(null);
const selectedItems = ref<mongoProduct[] | null>(null);

const dataEdit: Ref<Array<{ [key: string]: any }>> = ref([]);
const formSchemaEditProduct: Ref<FormField[]> = ref([]);
const formSchemaAddProduct: Ref<FormField[]> = ref([]);

const datas = ref<mongoProduct[]>([]);
const data = reactive({
  datas: datas,
  columns: [
    { name: 'Nom', key: 'name', sort: true, typeData: 'string' },
    { name: 'Stock', key: 'stock', sort: true, typeData: 'integer' },
    { name: 'Quantité', key: 'categoryName', sort: false, typeData: 'string' },
  ],
  actions: { edit: true, delete: true, visualize: true },
  numberOfItemsPerPage: [5, 10, 15, 20],
});

onMounted(async () => {
  await refreshProducts();
  const res = await getCategories();
  categories.value = res.categories;

  formSchemaEditProduct.value = [
    {
      label: 'Nom',
      component: "input",
      type: 'text',
      name: 'name',
      placeholder: 'Nom du produit',
      schema: z.object({
        name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
          .max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Description',
      component: "input",
      type: 'text',
      name: 'description',
      placeholder: 'Description du produit',
      schema: z.object({
        description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "La description doit contenir au moins 2 caractères" })
          .max(550, { message: "La description doit contenir au maximum 550 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Prix',
      component: "input",
      type: 'number',
      name: 'price',
      placeholder: 'Prix du produit',
      schema: z.object({
        price: z.number({ required_error: requiredMessage })
          .min(1, { message: "Le prix doit être d'au moins 1" })
          .max(999, { message: "Le prix ne peut pas dépasser 999" })
      }),
      col: 2,
      disabled: false,
    },    
    {
      label: 'Chemin de l\'image',
      component: "input",
      type: 'text',
      name: 'imagePath',
      placeholder: 'Chemin de l\'image du produit',
      schema: z.object({
        imagePath: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(1, { message: "Le chemin de l'image doit contenir au moins 1 caractère" })
          .max(50, { message: "Le chemin de l'image doit contenir au maximum 50 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Catégorie',
      component: "select",
      type: 'select',
      name: 'categoryId',
      placeholder: 'Catégorie du produit',
      schema: z.object({
        categoryId: z.string({
        required_error: requiredMessage,
          invalid_type_error: "Veuillez choisir une catégorie valide"
        }).nonempty("Veuillez choisir une catégorie")
      }),
      col: 2,
      disabled: false,
      optionsSelect: categoriesSchema.value,
    },
  ];

  formSchemaAddProduct.value = [
    {
      label: 'Nom',
      component: "input",
      type: 'text',
      name: 'name',
      placeholder: 'Nom du produit',
      schema: z.object({
        name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
          .max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Description',
      component: "input",
      type: 'text',
      name: 'description',
      placeholder: 'Description du produit',
      schema: z.object({
        description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "La description doit contenir au moins 2 caractères" })
          .max(550, { message: "La description doit contenir au maximum 550 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Prix',
      component: "input",
      type: 'number',
      name: 'price',
      placeholder: 'Prix du produit',
      schema: z.object({
        price: z.number({ required_error: requiredMessage })
          .min(1, { message: "Le prix doit être d'au moins 1" })
          .max(999, { message: "Le prix ne peut pas dépasser 999" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Stock',
      component: "input",
      type: 'number',
      name: 'stock',
      placeholder: 'Stock du produit',
      schema: z.object({
        stock: z.number({ required_error: requiredMessage })
          .min(0, { message: "Le stock doit être d'au moins 0" })
          .max(999, { message: "Le stock ne peut pas dépasser 999" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Chemin de l\'image',
      component: "input",
      type: 'text',
      name: 'imagePath',
      placeholder: 'Chemin de l\'image du produit',
      schema: z.object({
        imagePath: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(1, { message: "Le chemin de l'image doit contenir au moins 1 caractère" })
          .max(50, { message: "Le chemin de l'image doit contenir au maximum 50 caractères" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Seuil',
      component: "input",
      type: 'number',
      name: 'threshold',
      placeholder: 'Seuil du produit',
      schema: z.object({
        threshold: z.number({ required_error: requiredMessage })
          .min(0, { message: "Le seuil doit être d'au moins 0" })
          .max(999, { message: "Le seuil ne peut pas dépasser 999" })
      }),
      col: 2,
      disabled: false,
    },
    {
      label: 'Catégorie',
      component: "select",
      type: 'select',
      name: 'categoryId',
      placeholder: 'Catégorie du produit',
      schema: z.object({
        categoryId: z.string({
        required_error: requiredMessage,
          invalid_type_error: "Veuillez choisir une catégorie valide"
        }).nonempty("Veuillez choisir une catégorie")
      }),
      col: 2,
      disabled: false,
      optionsSelect: categoriesSchema.value,
    }
  ]
});

const refreshProducts = () => {
  getAllMongoProducts(datas => datas).then(res => datas.value = res.products);
}

function handleVisualize(item: mongoProduct) {
  productVisualizer.value = item;
}

function handleEdit(item: mongoProduct) {
  selectedItem.value = item;

  dataEdit.value = [
    { name: item.name },
    { description: item.description },
    { price: item.price },
    { imagePath: item.imagePath },
    { categoryId: item.categoryId },
  ];
  showModalEdit.value = true;
}

function handleDelete(item: mongoProduct) {
  selectedItem.value = item
  openModal.value = true
}

function handleDeleteMultiple(items: mongoProduct[]) {
  selectedItems.value = items
  openModalMultiple.value = true
}

function handleCreate() {
  showModalAdd.value = true
}

function updateProductFunc(newDataForUpdate: Record<string, any>) {
  if (!selectedItem.value) {
    return;
  }
  let body = {
    ...newDataForUpdate,
  };
  delete body.categoryId;
  body.CategoryId = newDataForUpdate.categoryId;
  updateProduct(selectedItem.value.postgresId, body)
  .then(() => {
    refreshProducts();
    showModalEdit.value = false;
    notificationStore.add({
      type: 'success',
      message: "Produit modifié avec succès",
      timeout: 3000,
    });
  })
  .catch(error => {
    notificationStore.add({
      type: 'error',
      message: "Erreur lors de la modification du produit",
      timeout: 3000,
    });
  });
}

function deleteItem(item: mongoProduct) {
  deleteProduct(item.postgresId).then(() => refreshProducts())
  notificationStore.add({
    type: 'success',
    message: "Produit supprimé avec succès",
    timeout: 3000,
  });
  openModal.value = false
}

function deleteItems(items: mongoProduct[]) {
  deleteMultiplesProducts(items.map(item => item.postgresId).join(','))
    .then(() => {
      refreshProducts();
    })
  notificationStore.add({
    type: 'success',
    message: "Produits supprimés avec succès",
    timeout: 3000,
  });
  openModalMultiple.value = false
}

function createProductFunc(newDataForCreate: Record<string, any>) {
  let body = {
    ...newDataForCreate,
  };
  delete body.categoryId;
  body.CategoryId = newDataForCreate.categoryId;
  createProduct(body as createProductDto)
  .then(() => {
    refreshProducts();
    showModalAdd.value = false;
    notificationStore.add({
      type: 'success',
      message: "Produit créé avec succès",
      timeout: 3000,
    });
  })
  .catch(error => {
    notificationStore.add({
      type: 'error',
      message: "Erreur lors de la création du produit",
      timeout: 3000,
    });
  });
}

</script>