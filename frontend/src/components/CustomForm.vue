<template>
  <component-wrapper :loading="props.loading">
    <form ref="formRef" class="form" :class="props.bordered ? '' : 'border-none shadow-none rounded-none' " @submit.prevent>
      <form-item
          v-for="item in formSchema"
          :class="item.col == 2 ? 'col-2' : item.col == 0 ? 'col-0' : ''"
          :key="item.name"
      >
        <template #label>
          <label :for="item.name" :class="item.error ? 'text-danger' : ''">
            {{ item.label }} <span v-if="getFieldRequired(item.name)" class="text-danger">*</span>
          </label>
        </template>
        <template #component>
          <input
          v-if="item.component === 'input'"
              :type="item.type"
              :id="item.name"
              :name="item.name"
              :min="getFieldMin(item.name) === null ? undefined : getFieldMin(item.name)!"
              :max="getFieldMax(item.name) === null ? undefined : getFieldMax(item.name)!"
              :placeholder="item.placeholder"
              :required="getFieldRequired(item.name)"
              @blur="validateField(item)"
              v-model="item.value"
              :disabled="item.disabled === undefined ? props.disabled : item.disabled"
          >
          <select v-else-if="item.component === 'select'"
              :id="item.name"
              :name="item.name"
              :required="getFieldRequired(item.name)"
              @blur="validateField(item)"
              v-model="item.value"
              :disabled="item.disabled === undefined ? props.disabled : item.disabled"
          >            
            <option value="placeholder" disabled selected>{{ item.placeholder }}</option>
            <option v-for="option in item.optionsSelect" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="item.error" class="text-danger pl-2 text-xs">{{ item.error }}</p>
        </template>
      </form-item>
      <footer class="w-full mt-4 flex flex-col items-center gap-4">
        <div class=" flex justify-center gap-4">
          <button type="submit" class="btn btn--primary" :class="props.disabled ? 'btn--disabled' : ''" @click="handleSubmit" :disabled="props.disabled">{{ submitText }}</button>
          <button v-if="showReset" type="reset" class="btn btn--danger" :class="props.disabled ? 'btn--disabled' : ''" @click="handleReset" :disabled="props.disabled">Reset</button>
          <slot name="footer"></slot>
        </div>
        <p v-if="props.loading">Veuillez patienter</p>
      </footer>
    </form>
  </component-wrapper>
</template>
<script lang="ts" setup generic="FieldSchema extends ZodObject<any>">
import FormItem from "@/components/FormItem.vue";
import { onUnmounted, ref } from "vue";
import { FormField } from "@/dto/formField.dto.ts";
import { useForm } from "@/composables/useForm.ts";
import { ZodObject } from "zod";
import ComponentWrapper from "@/components/ComponentWrapper.vue";

const formRef = ref(null);
onUnmounted(() => {
  formRef.value = null;
});
defineExpose({
  handleReset,
  getFieldsValue,
  SetFieldValue,
  formRef
});
const emit = defineEmits(["submit", "reset"]);
const props = defineProps({
  schema: {
    type: Array<FormField<FieldSchema>>,
    required: true
  },
  submitText: {
    type: String,
    default: "Submit"
  },
  showReset: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  }
})
const formSchema = ref<FormField<FieldSchema>[]>(props.schema);

const { getFieldRequired, getFieldMin, getFieldMax, validateField, validate } = useForm(formSchema);
function handleSubmit() {
  if(validate())
    emit("submit", formSchema.value);
}
function handleReset() {
  formSchema.value.forEach((item) => {
    if(item.disabled != true){
      item.value = undefined;
      item.error = undefined;
    }
  });
  emit("reset");
}
function getFieldsValue() {
  return formSchema.value.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {} as Record<string, any>);
}
function SetFieldValue(data: Record<string, any>, name: string) {
  const field = formSchema.value.find((item) => item.name === name);
  if(field) {
    field.value = data[name];
  }
}
</script>