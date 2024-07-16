<template>
  <div>
    <div>
      <h1>Composant custom table:</h1>
      <CustomizableTable
        :data="data.datas"
        :columns="data.columns"
        :actions="data.actions"
        :numberOfItemsPerPage="data.numberOfItemsPerPage"
        :canDeleteAll="true"
        @visualize-item="handleVisualize"
        @edit-item="handleEdit"
        @delete-item="handleDelete"
        @delete-multiple-items="handleMultipleDelete"
      ></CustomizableTable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import CustomizableTable from "@/components/common/custom-table/customizable-table.vue";

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
      name: "abapa",
      fullName: "banna",
      age: 23,
      email: "bam@ds.fr",
      phone: "+33 123456789",
      address: "124 Main St",
      birthday: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      name: "cpop",
      fullName: "adfff",
      age: 24,
      email: "cam@ds.fr",
      phone: "+33 123456789",
      address: "125 Main St",
      birthday: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Kari",
      fullName: "Renner",
      age: 664.77,
      email: "non",
      phone: "1-468-840-2255 x28383",
      address: "Clare Key",
      birthday: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Tyrique",
      fullName: "Hauck",
      age: 866.79,
      email: "quae",
      phone: "1-257-863-8984 x00340",
      address: "Chaz Road",
      birthday: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Asa",
      fullName: "Greenholt",
      age: 134.54,
      email: "quia",
      phone: "(371) 264-3543",
      address: "Boyle Ranch",
      birthday: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Meda",
      fullName: "Goyette",
      age: 147.4,
      email: "non",
      phone: "777.911.4928 x871",
      address: "Sydnee Garden",
      birthday: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Hillard",
      fullName: "Ratke",
      age: 49.76,
      email: "cum",
      phone: "1-854-846-1640",
      address: "Amya Junctions",
      birthday: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Polly",
      fullName: "Robel",
      age: 253.15,
      email: "nihil",
      phone: "1-461-658-6521 x107",
      address: "Cummings Squares",
      birthday: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Myrtis",
      fullName: "Frami",
      age: 978.46,
      email: "ut",
      phone: "(330) 474-5546",
      address: "Schaden Islands",
      birthday: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Loraine",
      fullName: "Reichert",
      age: 540.23,
      email: "impedit",
      phone: "(802) 589-7751 x1431",
      address: "Frieda Village",
      birthday: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Macy",
      fullName: "Bauch",
      age: 371.52,
      email: "reprehenderit",
      phone: "1-412-931-1003 x21503",
      address: "Waylon Oval",
      birthday: new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Aidan",
      fullName: "Reilly",
      age: 886.37,
      email: "nisi",
      phone: "(968) 951-3655 x54707",
      address: "Maye Tunnel",
      birthday: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Sid",
      fullName: "Witting",
      age: 315.63,
      email: "ad",
      phone: "275-284-9184 x30500",
      address: "Bogan Islands",
      birthday: new Date(new Date().getTime() + 13 * 24 * 60 * 60 * 1000),
    },
  ],
  columns: [
    { name: "Name", key: "name", sort: true, typeData: "string" },
    { name: "Full Name", key: "fullName", sort: true, typeData: "string" },
    { name: "Age", key: "age", sort: true, typeData: "number" },
    { name: "Email", key: "email", sort: true, typeData: "string" },
    { name: "Phone", key: "phone", sort: false, typeData: "string" },
    { name: "Address", key: "address", sort: true, typeData: "string" },
    { name: "Birthday", key: "birthday", sort: true, typeData: "date" },
  ],
  actions: { edit: true, delete: true, visualize: true },
  numberOfItemsPerPage: [5, 10, 15, 20],
});

function handleVisualize(item: any) {
  console.log("Visualize item:", item);
  // todo: open modal to visualize item
  alert("Visualize item: " + JSON.stringify(item));
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
