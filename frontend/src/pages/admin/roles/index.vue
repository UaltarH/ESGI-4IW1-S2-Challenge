<template>
<div class="py-24">
  <h1>Roles</h1>
  <ul>
    <li v-for="role in roles" :key="role">{{ role }}</li>
  </ul>
  <button type="button" @click="handleOpenModal" class="btn btn--primary">Open Modal</button>
</div>
<confirm-modal v-if="showModal" :title="title" size="xl" @confirm="handleConfirm" @close="handleClose">
  <template #content>
    <p v-html="content"></p>
  </template>
</confirm-modal>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Response} from "../../../dto/response.dto";
import ConfirmModal from "../../../components/ConfirmModal.vue";

onMounted(() => {
  fetchRoles();
});
const roles = ref<string[]>([]);
const title = ref<string>("Confirmation");
const content = ref<string | HTMLElement>("Êtes-vous sûr de vouloir <b>continuer</b> ?");
const showModal = ref<boolean>(false);

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

function handleOpenModal() {
  showModal.value = true;
}
function handleConfirm() {
  showModal.value = false;
}
function handleClose() {
  showModal.value = false;
}
</script>