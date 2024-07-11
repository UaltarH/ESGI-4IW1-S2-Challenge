import { defineStore } from 'pinia'
import {ref} from "vue";
import {Notification} from "@/dto/notification.dto.ts";

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([] as Notification[]);
    function add(notification: Notification) {
        notifications.value.push({ ...notification });
    }
    return { notifications, add }
});
