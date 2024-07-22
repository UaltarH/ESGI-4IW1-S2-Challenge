<template>
    <div>
      <div v-if="alertStore.isLoading">Chargement des notifications...</div>
      <div v-else-if="alertStore.error">{{ alertStore.error }}</div>
      <div v-else>
        <p>Vous avez {{ alertStore.adminUnreadCount }} notifications admin non lues.</p>
        <ul>
          <li v-for="notification in alertStore.adminNotifications" :key="notification._id" class="mb-4 p-2 border rounded">
            <div :class="{ 'font-bold': !notification.read }">{{ notification.message }}</div>
            <div class="text-sm text-gray-500">{{ new Date(notification.createdAt).toLocaleString() }}</div>
            <div class="mt-2">
              <button @click="alertStore.markAsRead(notification._id, true)" class="mr-2 text-blue-500" v-if="!notification.read">
                Marquer comme lu
              </button>
              <button @click="alertStore.removeNotification(notification._id, true)" class="text-red-500">
                Supprimer
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useAlertStore } from "@/stores/alert.ts";
  import { onMounted } from "vue";
  
  const alertStore = useAlertStore();
  
  onMounted(() => {
    alertStore.fetchNotifications();
  });
  </script>