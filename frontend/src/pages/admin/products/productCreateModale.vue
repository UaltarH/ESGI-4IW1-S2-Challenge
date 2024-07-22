<template>
  <DialogContent class="overflow-auto h-[90vh]">
    <DialogHeader>
      <DialogTitle class="text-xl font-semibold">Création d'un produit</DialogTitle>
      <DialogDescription class="text-gray-600 mt-2">
        Remplissez les champs ci-dessous pour créer un nouveau produit.
      </DialogDescription>
    </DialogHeader>
    <Form 
      ref="formRef" 
      :schema="formSchema"
      @submit="handleSubmit" 
      :disabled="formDisabled" 
      :loading="formLoading"
      :show-reset="true" 
    />
  </DialogContent>
</template>

<script lang="ts" setup>
import { defineEmits, ref, computed, watch, Ref } from 'vue';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Form from "@/components/CustomForm.vue";
import { formMessages } from "@/composables/formMessages";
import { FormField } from "@/dto/formField.dto.ts";
import { z } from "zod";
import { ProductService } from '@/composables/api/products.service.ts';
import { createProduct } from '@/dto/api/product.dto';
import { Category } from '@/dto/category.dto';
import { CategoriesService } from "@/composables/api/categories.service";

const { getCategories } = CategoriesService();
const categories = ref<Category[]>([]);
getCategories().then(res => categories.value = res.categories);

const { requiredMessage, invalidStringMessage, invalidNumberMessage } = formMessages();

const formLoading = ref(false);
const formDisabled = ref(false);
const formRef = ref<{ formRef: Ref<any>, SetFieldValue: Function, getFieldsValue: Function, handleReset: Function } | null>(null);

const categoryOptions = computed(() => 
  categories.value.map((category: Category) => ({
    value: category.id,
    label: category.name,
  }))
);

const formSchema = ref<FormField<any>[]>([]);

const updateFormSchema = () => {
  formSchema.value = [
    {
      label: "Nom du produit",
      component: "input",
      type: "text",
      name: "name",
      placeholder: "Entrez le nom du produit",
      schema: z.object({
        name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(2, { message: "Le nom du produit doit contenir au moins 2 caractères" })
          .max(100, { message: "Le nom du produit doit contenir au maximum 100 caractères" }),
      }),
      col: 2,
    },
    {
      label: "Description",
      component: "input",
      name: "description",
      type: "text",
      placeholder: "Entrez la description du produit",
      schema: z.object({
        description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .min(10, { message: "La description doit contenir au moins 10 caractères" })
          .max(1000, { message: "La description doit contenir au maximum 1000 caractères" }),
      }),
      col: 2,
    },
    {
      label: "Prix",
      component: "input",
      type: "number",
      name: "price",
      placeholder: "Entrez le prix du produit",
      schema: z.object({
        price: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
          .min(0.01, { message: "Le prix doit être supérieur à 0" }),
      }),
      col: 2,
    },
    {
      label: "Stock",
      component: "input",
      type: "number",
      name: "stock",
      placeholder: "Entrez la quantité en stock",
      schema: z.object({
        stock: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
          .int({ message: "Le stock doit être un nombre entier" })
          .min(0, { message: "Le stock doit être au moins 0" }),
      }),
      col: 2,
    },
    {
      label: "Chemin de l'image",
      component: "input",
      type: "text",
      name: "imagePath",
      placeholder: "Entrez le chemin de l'image",
      schema: z.object({
        imagePath: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .url({ message: "Le chemin de l'image doit être une URL valide" })
          .min(5, { message: "Le chemin de l'image doit contenir au moins 5 caractères" }),
      }),
      col: 2,
    },
    {
      label: "Seuil",
      component: "input",
      type: "number",
      name: "threshold",
      placeholder: "Entrez le seuil d'alerte de stock",
      schema: z.object({
        threshold: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
          .int({ message: "Le seuil doit être un nombre entier" })
          .min(0, { message: "Le seuil doit être au moins 0" }),
      }),
      col: 2,
    },
    {
      label: "Catégorie",
      component: "select",
      type: "text",
      name: "CategoryId",
      optionsSelect: categoryOptions.value,
      placeholder: "Sélectionnez une catégorie",
      schema: z.object({
        CategoryId: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
          .uuid({ message: "L'ID de catégorie doit être un UUID valide" }),
      }),
      col: 2,
    },
  ];
};

watch(categoryOptions, () => {
  updateFormSchema();
}, { immediate: true }); 

updateFormSchema();

const emits = defineEmits(['close']);

const onClose = () => {
  emits('close');
};

async function handleSubmit(schema: FormField<any>[]) {
  let param: createProduct = {};
  schema.forEach((item) => {
    if (item.value !== undefined)
      param[item.name] = item.value;
  });
  formLoading.value = true;
  formDisabled.value = true;
  await ProductService().createProduct(param).then(() => onClose())
}
</script>
