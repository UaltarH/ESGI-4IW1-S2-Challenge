<template>
    <div>
        <h1>Utilisateurs:</h1>
        <CustomizableTable
        :data="data.datas"
        :columns="data.columns"
        :actions="data.actions"
        :numberOfItemsPerPage="data.numberOfItemsPerPage"
        @visualize-item="handleVisualize"
        @edit-item="handleEdit"
        @delete-item="handleDelete"
        @delete-multiple-items="handleMultipleDelete"
        ></CustomizableTable>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import CustomizableTable from "@/components/common/custom-table/customizable-table.vue";
import {useUserManagement} from "@/composables/api/useUserManagement";
import { ref } from "vue";

const { getUsers } = useUserManagement();

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

const datas: [] = ref<User[]>([]);
getUsers((datas: []) => datas).then(res => datas.value = res.users);

const data = reactive({
    datas: datas,
    columns: [
    { name: "ID", key: "id", sort: true, typeData: "string" },
    { name: "Email", key: "email", sort: true, typeData: "string" },
    { name: "Téléphone", key: "phone", sort: false, typeData: "string" },
    ],
    actions: { edit: true, delete: true, visualize: true },
    numberOfItemsPerPage: [5, 10, 15, 20],
});

function handleVisualize(item: any) {
    console.log("Visualize item:", item);
    window.location.href = `/admin/users/${item.id}`;
}

function handleEdit(item: any) {
    console.log("Edit item:", item);
    // todo: open modal to edit item
    // todo: make query to edit item from database using backend
    alert("Edit item: " + JSON.stringify(item));
}

function handleDelete(item: any) {
    console.log("Delete item:", item);
    alert("Delete item: " + JSON.stringify(item));
    //delete item from data
    //todo: make query to delete item from database using backend
    data.datas = data.datas.filter((data) => data !== item);
}

function handleMultipleDelete(items: any[]) {
    console.log("Delete items:", items);
    alert("Delete items: " + JSON.stringify(items));
    // delete items from data
    // todo: make query to delete items from database using backend
    data.datas = data.datas.filter((data) => !items.includes(data));
}
</script>
