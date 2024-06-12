<template>
  <div class="py-24">
    <h1>Home</h1>
    <CustomizableTable
      :data="data.datas"
      :columns="data.columns"
      :actions="data.actions"
      @edit-item="handleEdit"
      @delete-item="handleDelete"
    ></CustomizableTable>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import CustomizableTable from "../components/common/custom-table/customizable-table.vue";

const data = reactive({
  datas: [
    {
      name: "aohn",
      fullName: "cravolta",
      age: 22,
      email: "am@ds.fr",
      phone: "+33 123456789",
      address: "123 Main St",
      birthday: new Date(),
    },
    {
      name: "bapa",
      fullName: "banna",
      age: 22,
      email: "bam@ds.fr",
      phone: "+33 123456789",
      address: "124 Main St",
      birthday: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      name: "cpop",
      fullName: "adfff",
      age: 22,
      email: "cam@ds.fr",
      phone: "+33 123456789",
      address: "125 Main St",
      birthday: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    },
  ],
  columns: [
    { name: "Name", key: "name", sort: true },
    { name: "Full Name", key: "fullName", sort: true },
    { name: "Age", key: "age", sort: true },
    { name: "Email", key: "email", sort: true },
    { name: "Phone", key: "phone", sort: false },
    { name: "Address", key: "address", sort: true },
    { name: "Birthday", key: "birthday", sort: true },
  ],
  actions: { edit: true, delete: true },
});

let data2 = reactive(
  Array.from({ length: 50 }, (_, index) => ({
    name: `John${index + 1}`,
    fullName: `Travolta${index + 1}`,
    age: 22 + index,
    email: `john${index + 1}@example.com`,
    phone: `123456789${index}`,
    address: `123${index + 1} Main St`,
    birthday: new Date(),
  }))
);

function handleEdit(item: any) {
  console.log("Edit item:", item);
}

function handleDelete(item: any) {
  console.log("Delete item:", item);
}
</script>
