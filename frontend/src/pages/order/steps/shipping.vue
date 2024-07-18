<template>
    <div class="flex flex-col justify-center gap-5">
        <div class="flex flex-col justify-between mx-8 items-center lg:flex-row lg:items-start">
            <h2 class="text-2xl font-bold">Informations de livraison</h2>
            <div class="flex items-center">
                <p class="text-sm mr-2">Utiliser les informations de votre compte :</p>
                <Switch @update:checked="toggleSwitch" />
            </div>
        </div>

        <CustomForm class="lg:w-2/3 rounded-none self-center" ref="formRef" :schema="formSchema" @submit="handleVerif" :submitText="'Sauvegarder'" :show-reset="false"/>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { z } from "zod";
import CustomForm from "@/components/CustomForm.vue";
import { FormField } from "@/dto/formField.dto.ts";
import { formMessages } from "@/composables/formMessages";
import { Switch } from '@/components/ui/switch';
import { UserService } from "@/composables/api/user.service.ts";
import { useUserStore } from "@/stores/user";
import { User } from '@/dto/user.dto';
import {shipping} from '@/dto/shipping.dto';

const userStore = useUserStore();
const { getUserById } = UserService();

const { requiredMessage, invalidStringMessage } = formMessages();
const formRef = ref<{formRef:Ref<any>, SetFieldValue:Function, getFieldsValue:Function, handleReset:Function} | null>(null);
const formSchema = ref<FormField<any>[]>([
    {
        label: "Methode de livraison",
        component: "select",
        type: "select",
        name: "shippingMethod",
        placeholder: "Choisissez votre méthode de livraison",
        schema: z.object({
            shippingMethod: z.enum(["express", "standard", "placeholder"], {
                required_error: requiredMessage,
                invalid_type_error: "Veuillez choisir une méthode de livraison valide"
            }).refine(value => value !== "placeholder", {
                message: "Veuillez choisir une méthode de livraison valide"
            })
        }),
        col: 2,
        optionsSelect: [
            { value: "express", label: "Express" },
            { value: "standard", label: "Standard" },
        ],
        value: "placeholder",
    },
    {
        label: "Adresse de livraison",
        component: "input",
        type: "text",
        name: "address",
        placeholder: "Entrez votre adresse de livraison",
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
            country: z.literal("France", {
            invalid_type_error: "Le pays doit être la France"
            })
        }),
        col: 2,
    },  
]);

const usePersonnalInfo = ref(false);
const user = ref<User>();

const props = defineProps({
    infoShipping: {
        type: Object as () => shipping | null,
        default: null,
    },
});

const emit = defineEmits([
  "saveInfoShipping",
]);

onMounted(async () => {
    if(props.infoShipping !== null) {
        formRef.value?.SetFieldValue({shippingMethod: props.infoShipping.shippingMethod}, "shippingMethod");
        formRef.value?.SetFieldValue({address: props.infoShipping.address}, "address");
        formRef.value?.SetFieldValue({zipcode: props.infoShipping.zipcode}, "zipcode");
        formRef.value?.SetFieldValue({city: props.infoShipping.city}, "city");
        formRef.value?.SetFieldValue({country: props.infoShipping.country}, "country");        
    }

    await getUserById(
        userStore.user.id,
        handleUserInfo,
        {fields: ["address", "zipcode", "city", "country"]}
    );
});

async function handleVerif() {
  emit("saveInfoShipping", formRef.value?.getFieldsValue() as shipping);
}

const toggleSwitch = () => {
    usePersonnalInfo.value = !usePersonnalInfo.value;

    if(usePersonnalInfo.value) {
        if(user.value === undefined) {
            return;
        }
        formRef.value?.SetFieldValue({address: user.value.address}, "address");
        formRef.value?.SetFieldValue({zipcode: user.value.zipcode}, "zipcode");
        formRef.value?.SetFieldValue({city: user.value.city}, "city");
        formRef.value?.SetFieldValue({country: user.value.country}, "country");
    } else {
        formRef.value?.SetFieldValue({address: ""}, "address");
        formRef.value?.SetFieldValue({zipcode: ""}, "zipcode");
        formRef.value?.SetFieldValue({city: ""}, "city");
        formRef.value?.SetFieldValue({country: "France"}, "country");
    }
}

function handleUserInfo(res: Response) {
  res.json().then((data) => {
    if(!data.user) {      
      return;
    }
    user.value = data.user;
    
  });
}

</script>
<style scoped>

</style>