<template>
    <div class="flex flex-col justify-center gap-5 dark:bg-dark-blue-dark px-4 pt-8 rounded-lg dark:text-white">
        <div class="flex flex-col justify-between mx-8 lg:flex-row">
            <h2 class="text-2xl font-bold">Informations de facturation</h2>
            <div class="flex items-center">
                <p class="text-sm mr-2">Utiliser les informations de votre livraison :</p>
                <Switch @update:checked="toggleSwitch" />
            </div>
        </div>

        <CustomForm class="lg:w-2/3 rounded-none self-center" ref="formRef" :schema="formSchema" @submit="handleVerif" :submitText="'Sauvegarder'" :show-reset="true" :bordered="false"/>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { z } from "zod";
import CustomForm from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { formMessages } from "@/composables/formMessages";
import { Switch } from '@/components/ui/switch';
import {invoice} from '@/dto/invoice.dto';
import {shipping} from '@/dto/shipping.dto';


const { requiredMessage, invalidStringMessage } = formMessages();
const formRef = ref<{formRef:Ref<any>, SetFieldValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null);
const formSchema = ref<FormField<any>[]>([    
    {
        label: "Adresse de facturation",
        component: "input",
        type: "text",
        name: "address",
        placeholder: "Entrez votre adresse de facturation",
        schema: z.object({
            address: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
                .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
                .max(200, { message: "L'adresse ne doit pas dépasser 200 caractères" })
                .regex(/^[a-zA-Z0-9\s,'-]*$/, {
                    message: "L'adresse ne doit contenir que des lettres, des chiffres, des espaces et les caractères , ' -"
                })
                .refine(
                    (value) => !/^\s*$/.test(value),
                    { message: "L'adresse ne peut pas être composée uniquement d'espaces" }
                )
            }
        ),
        col: 2,
    },
    {
        label: "Ville",
        component: "input",
        type: "text",
        name: "city",
        placeholder: "Entrez votre ville",
        schema: z.object({
        city: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
                .min(5, { message: "La ville doit contenir au moins 3 caractères" })
                .max(200, { message: "La ville ne doit pas dépasser 200 caractères" })
                .regex(/^[a-zA-Z0-9\s,'-]*$/, {
                    message: "La ville ne doit contenir que des lettres, des chiffres, des espaces et les caractères , ' -"
                })
                .refine(
                    (value) => !/^\s*$/.test(value),
                    { message: "La ville ne peut pas être composée uniquement d'espaces" }
                )
            }
        ),
        col: 2,
    },
    {
        label: "Code postal",
        component: "input",
        type: "number",
        name: "zipcode",
        placeholder: "Entrez votre code postal",
        schema: z.object({
            zipcode: z.number({
                required_error: "Le code postal est requis",
                invalid_type_error: "Le code postal doit être un nombre"
            })
            .int({ message: "Le code postal doit être un nombre entier" })
            .min(1000, { message: "Le code postal doit être supérieur ou égal à 01000" })
            .max(99999, { message: "Le code postal doit être inférieur ou égal à 99999" })
        }),
        col: 2,
    },
    {
        label: "Pays",
        component: "input",
        type: "text",
        name: "country",
        placeholder: "France",
        value: "France",
        disabled: true,
        schema: z.object({
            country: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
                .min(2, { message: "Le pays doit contenir au moins 2 caractères" }).max(50, { message: "Le pays doit contenir au maximum 50 caractères" }),
        }),
        col: 2,
    },  
]);

const useShippingInfo = ref(false);

const props = defineProps({
    infoInvoice: {
        type: Object as () => invoice | null,
        default: null,
    },
    infoShipping: {
        type: Object as () => shipping | null,
        default: null,
    },
});

const emit = defineEmits([
  "saveInfoInvoice",
]);

onMounted(async () => {
    if(props.infoInvoice !== null) {
        formRef.value?.SetFieldValue({address: props.infoInvoice.address}, "address");
        formRef.value?.SetFieldValue({zipcode: props.infoInvoice.zipcode}, "zipcode");
        formRef.value?.SetFieldValue({city: props.infoInvoice.city}, "city");
        formRef.value?.SetFieldValue({country: props.infoInvoice.country}, "country");        
    }
});

async function handleVerif() {
  emit("saveInfoInvoice", formRef.value?.getFieldsValue() as invoice);
}

const toggleSwitch = () => {
    useShippingInfo.value = !useShippingInfo.value;

    if(useShippingInfo.value && props.infoShipping !== null) {      
        formRef.value?.SetFieldValue({address: props.infoShipping.address}, "address");
        formRef.value?.SetFieldValue({zipcode: props.infoShipping.zipcode}, "zipcode");
        formRef.value?.SetFieldValue({city: props.infoShipping.city}, "city");
        formRef.value?.SetFieldValue({country: props.infoShipping.country}, "country");                
    } else {
        formRef.value?.SetFieldValue({address: ""}, "address");
        formRef.value?.SetFieldValue({zipcode: ""}, "zipcode");
        formRef.value?.SetFieldValue({city: ""}, "city");
        formRef.value?.SetFieldValue({country: "France"}, "country");
    }
}

</script>
<style scoped>

</style>