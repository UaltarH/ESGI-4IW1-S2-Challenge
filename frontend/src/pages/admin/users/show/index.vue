<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">User Information</h1>
        <div class="bg-white shadow-md rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(value, key) in user" :key="key" class="flex flex-col">
                    <label class="font-semibold capitalize">{{ key }}</label>
                    <span class="text-gray-700">
                    {{ formatValue(value, key) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useUserManagement} from "@/composables/api/useUserManagement";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const { getUser } = useUserManagement();

interface User {
    address: string,
    birthdate: Date,
    city: string,
    country: string,
    createdAt: Date,
    deletedAt: Date,
    email: string,
    firstname: string,
    id: string,
    lastname: string,
    password: string,
    phone: string,
    role: string,
    updatedAt: Date,
    zipcode: number,
}

const user: User = ref<User | undefined>();
getUser(route.params.id, (datas: []) => datas).then(res => user.value = res.user);


const formatValue = (value: any, key: string) => {
  if (key === 'birthdate' || key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt') {
    return value ? new Date(value).toLocaleDateString() : 'N/A';
  }
  if (key === 'password') {
    return '*********';
  }
  return value || 'N/A';
};



</script>
  