<template>
  <form class="form" @submit.prevent>
    <form-item
        v-for="item in formSchema"
        :class="item.col == 2 ? 'col-2' : item.col == 0 ? 'col-0' : ''"
    >
      <template #label>
        <label :for="item.name" :class="item.error ? 'text-danger' : ''">
          {{ item.label }} <span v-if="getFieldRequired(item.name)" class="text-danger">*</span>
        </label>
      </template>
      <template #component>
        <input
            :type="item.type"
            :id="item.name"
            :name="item.name"
            :min="getFieldMin(item.name) === null ? undefined : getFieldMin(item.name)!"
            :max="getFieldMax(item.name) === null ? undefined : getFieldMax(item.name)!"
            :placeholder="item.placeholder"
            :required="getFieldRequired(item.name)"
            @blur="validateField(item)"
            v-model="item.value"
        >
        <p v-if="item.error" class="text-danger pl-2 text-xs">{{ item.error }}</p>
      </template>
    </form-item>
    <footer class="w-full flex justify-center gap-4">
      <button type="submit" class="btn btn--primary" @click="handleSubmit">{{ submitText }}</button>
      <button v-if="showReset" type="reset" class="btn btn--danger" @click="handleReset">Reset</button>
    </footer>
  </form>
</template>
<script lang="ts" setup generic="Schema extends ZodSchema">
import FormItem from "@/components/FormItem.vue";
import {onMounted, ref} from "vue";
import {FormSchema} from "@/dto/formSchema.dto.ts";
import {useForm} from "@/composables/useForm.ts";
import {ZodSchema} from "zod";

onMounted(() => {
  console.log("Form mounted");
});
const emit = defineEmits(["submit", "reset"]);
const props = defineProps({
  schema: {
    type: Array<FormSchema<Schema>>,
    required: true
  },
  submitText: {
    type: String,
    default: "Submit"
  },
  showReset: {
    type: Boolean,
    default: true
  }
})
const formSchema = ref<FormSchema<Schema>[]>(props.schema);

const {getFieldRequired, getFieldMin, getFieldMax, validateField, validate} = useForm(formSchema);
// const getValidationSchema = ()=> {
//   let schema:ZodObject<any> = z.object({});
//   formSchema.value.forEach((item) => {
//     schema = schema.merge(item.schema);
//   });
//   return schema;
// }
// const getFieldValues = () => {
//   let values:{[key:string] : string|undefined|number|Date} = {};
//   formSchema.value.forEach((item) => {
//     values[item.name] = item.value;
//   });
//   return values;
// }
// const getFieldShape = (name: string) => {
//   const formItem = formSchema.value.find((item) => item.name == name);
//   if(typeof formItem == "undefined") {
//     throw new Error(`Field ${name} not found`);
//   }
//   const schema = formItem.schema;
//   return schema.shape[name];
// }
// const getFieldRequired = (name: string): boolean => {
//   return !getFieldShape(name).isOptional();
// }
// const getFieldMin = (name: string): number|null => {
//   return getFieldShape(name).minLength;
// }
// const getFieldMax = (name: string): number|null => {
//   return getFieldShape(name).maxLength;
// }
// // TODO: cleanup console logs later
// function validateField (item: FormSchema): boolean {
//   console.log(`Validating ${item.name}`);
//   console.log(`Value: ${item.value}`)
//   item.error = "";
//   const res = item.schema.safeParse({[item.name]: item.value});
//   console.log(res);
//   if(!res.success) {
//     item.error = res.error.issues[0].message;
//     console.log(res.error.issues)
//     console.log('schema invalid');
//     return false;
//   }
//   if(item.dependsOn !== undefined) {
//     const dependency = formSchema.value.find((field) => field.name == item.dependsOn!.field);
//     if(typeof dependency == "undefined") {
//       throw new Error(`Dependent field ${item.dependsOn} not found`);
//     }
//     if(dependency.value !== item.value) {
//       console.log('schema invalid : depends');
//       item.error = item.dependsOn.errorMessage;
//       return false;
//     }
//   }
//   console.log('schema valid');
//   return true;
// }
// function validate(): boolean {
//   console.log("Validating form");
//   let res = getValidationSchema().safeParse(getFieldValues());
//   console.log(res);
//   if(!res.success) {
//     for (const issue of res.error.issues) {
//       const field =  formSchema.value.find((item) => {
//         return item.name == issue.path[0];
//       })
//       if(typeof field != "undefined") {
//         field.error = issue.message;
//       }
//     }
//     return false;
//   }
//   return true;
// }
function handleSubmit() {
  console.log("Submitting form");
  if(validate())
    emit("submit", formSchema.value);
}
function handleReset() {
  console.log("Resetting form");
  formSchema.value.forEach((item) => {
    item.value = undefined;
    item.error = undefined;
  });
  emit("reset");
}
</script>