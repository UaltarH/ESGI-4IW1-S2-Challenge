<template>
<div class="py-24">
  <h1>Roles</h1>
  <ul>
    <li v-for="role in roles" :key="role">{{ role }}</li>
  </ul>
</div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Response} from "../../../dto/response.dto";

onMounted(() => {
  fetchRoles();
});
const roles = ref<string[]>([]);

const fetchRoles = async () => {
  fetch("http://localhost:8000/user/roles")
      .then((res) => {
        return res.json();
      }).then((data:Response) => {
    if(data.success)
      roles.value = data.data;
    else
      throw new Error(data.message);
  }).catch((error) => {
    console.log(error);
  });
};
</script>