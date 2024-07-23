<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal" :style="`width:${getSize()}`">
      <header class="w-full flex-0.5 relative pb-4 border-b">
        <h1 class="text-xl">{{ title }}</h1>
        <button
          type="button"
          class="absolute -right-4 -top-4 w-8 h-8 btn--cancel text-2xl"
          @click="handleClose"
          aria-label="Close modal"
        >
          &times;
        </button>
      </header>
      <CustomForm
        ref="formRef"
        :schema="formSchema"
        submit-text="Sauvegarder"
        @submit="handleSubmit"
        :show-reset="false"
        :bordered="false"
      >
        <template #footer>
          <button type="button" class="btn btn--cancel" @click="handleClose">Annuler</button>
        </template>
      </CustomForm>
      <div>
        <slot name="footerModal"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup generic="FieldSchema extends ZodObject<any>">

import { FormField } from "@/dto/formField.dto.ts";
import { ZodObject } from "zod";    
import { Ref, ref, onMounted, PropType} from "vue";
import CustomForm from "@/components/CustomForm.vue";



const emits = defineEmits(['close', 'submit']);
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    formSchema: {
        type: Array<FormField<FieldSchema>>,
        required: true,
    },
    size: {
      type: String,
      default: 'md'
    },
    data: {
        type: Array as PropType<Array<{ [key: string]: any }>>,
        required: false,
    }
});

const sizes:{[key:string]:string} = {
  'sm': '25%',
  'md': '50%',
  'lg': '75%',
  'xl': '100%',
};
    
const formRef = ref<{formRef:Ref<any>, SetFieldValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null); 

onMounted(() => {
    if (props.data && formRef.value) {
        props.data.forEach((item) => {
            const [key, value] = Object.entries(item)[0];
            formRef.value?.SetFieldValue({ [key]: value }, key);
        });
    }
});

async function handleSubmit() {    
    emits('submit', formRef.value?.getFieldsValue());
}

function handleClose() {
    emits('close');
}

function getSize() {
  return sizes[props.size];
}

</script>