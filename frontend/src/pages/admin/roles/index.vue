<template>
<div class="py-24">
  <h1>Roles</h1>
  <ul>
    <li v-for="role in roles" :key="role">{{ role }}</li>
  </ul>
  <button type="button" @click="handleOpenModal" class="btn btn--primary">Open Modal</button>
</div>
<transition>
  <confirm-modal
      v-if="showModal"
      :data=user
      :title="title"
      size="sm"
      @confirm="handleConfirm"
      @close="handleClose"
      :action="deleteUser"
  >
    <template #content>
      <p>{{content}}</p>
    </template>
  </confirm-modal>
</transition>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ApiResponse} from "@/dto/apiResponse.dto.ts";
import ConfirmModal from "@/components/ConfirmModal.vue";
import {useUserManagement} from "@/composables/useUserManagement.ts";

const { getRoles, getUser, deleteUser } = useUserManagement();
onMounted(async () => {
  await fetchRoles();
  await fetchUser();
});
const user = ref();
const roles = ref<string[]>([]);
const title = ref<string>("Confirmation de suppression");
const content = ref<string | HTMLElement>();
const showModal = ref<boolean>(false);

const fetchRoles = async () => {
  await getRoles(handleFetchRoles);
};
// exemples
function handleFetchRoles(res: Promise<ApiResponse>) {
  res.then((data:ApiResponse) => {
    if(data.success)
      roles.value = data.data;
    else
      throw new Error(data.message);
  });
}
// exemple
const fetchUser = async () => {
  await getUser(2, handleFetchUser);
};
function handleFetchUser(res: Promise<ApiResponse>) {
  res.then((data:ApiResponse) => {
    if(data.success) {
      user.value = data.data;
      content.value = "Êtes-vous sûr de vouloir supprimer " + user.value.username + "?"
    }
    else {
      content.value = data.message;
      throw new Error(data.message);
    }
  });
}
function handleOpenModal() {
  showModal.value = true;
}
/**
 * En cas de succès, c'est ici qu'on gère la réponse
 */
function handleConfirm() {
  showModal.value = false;
}
function handleClose() {
  showModal.value = false;
}
</script>
<style>
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}
</style>