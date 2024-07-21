<template>
<DialogContent class="overflow-auto h-[90vh]">
    <DialogHeader>
    <DialogTitle class="text-xl font-semibold">Création d'un utilisateur</DialogTitle>
    <DialogDescription class="text-gray-600 mt-2">
        Remplissez les champs ci-dessous pour créer un nouvel utilisateur.
    </DialogDescription>
    </DialogHeader>
    <RegisterForm
        :is-for-admin="true"
        @close="onClose()"
    />
</DialogContent>
</template>
  

<script lang="ts" setup>
import { reactive, defineEmits, watch } from 'vue';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/dto/user.dto';
import RegisterForm from "@/components/RegisterForm.vue";

const emits = defineEmits(['close', 'save']);
const props = defineProps<{ 
  errors: Record<string, string>,
}>();

watch(() => props.errors, (newVal) => {
  Object.assign(item, newVal);
}, { deep: true });

const item = reactive<Partial<User>>({
  address: '',
  birthdate: new Date(),
  city: '',
  country: '',
  email: '',
  firstname: '',
  password: '',
  id: '',
  lastname: '',
  phone: '',
  role: 'user',
  zipcode: ''
});

const onClose = () => {
    emits('close');
};
</script>

