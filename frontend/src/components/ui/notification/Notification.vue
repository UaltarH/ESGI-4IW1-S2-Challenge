<template>
  <template v-if="currentNotifications.length > 0">
    <template v-for="(notification, index) in currentNotifications" >
      <SuccessNotification
          v-if="notification.type === 'success'"
          :message="notification.message"
          :style="'bottom: calc(10px + (80px * '+index+'));'"
      />
      <ErrorNotification
          v-if="notification.type === 'error'"
          :message="notification.message"
          :style="'bottom: calc(10px + (80px * '+index+'));'"
      />
      <InfoNotification
          v-if="notification.type === 'info'"
          :message="notification.message"
          :style="'bottom: calc(10px + (80px * '+index+'));'"
      />
    </template>
  </template>

</template>
<script lang="ts" setup>
import { useNotificationStore} from "@/stores/notification.ts";
import {ref, unref, watch} from "vue";
import { Notification } from "@/dto/notification.dto";
import SuccessNotification from "@/components/ui/notification/SuccessNotification.vue";
import ErrorNotification from "@/components/ui/notification/ErrorNotification.vue";
import InfoNotification from "@/components/ui/notification/InfoNotification.vue";

const notificationStore = useNotificationStore();
const currentNotifications = ref<Notification[]>([] as Notification[]);

function getNotification() {
  let currentNotification = notificationStore.notifications.shift();
  if (currentNotification) {
    currentNotifications.value.push(currentNotification);
    setTimeout(() => {
      getNotification();
      if(unref(currentNotifications).length > 0) {
        console.log(unref(currentNotifications))
        currentNotifications.value.shift();
        console.log(currentNotifications.value)
      }
    }, currentNotification.timeout)
  }
}
watch(
    () => notificationStore.notifications.length,
    () => {
      console.log('Running')
        getNotification()
    },
    { immediate: true }
)

</script>