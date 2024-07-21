import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { NotificationService } from '@/composables/api/notifications/notifications.service';
import { MongoNotification } from '@/composables/api/notifications/dto/mongoNotification.dto';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const useAlertStore = defineStore('alert', () => {
  const userNotifications = ref<MongoNotification[]>([]);
  const adminNotifications = ref<MongoNotification[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { getNotificationsForUser } = NotificationService();

  const userUnreadCount = computed(() => 
    userNotifications.value.filter(n => !n.read).length
  );

  const adminUnreadCount = computed(() => 
    adminNotifications.value.filter(n => !n.read).length
  );

  async function fetchNotifications() {
    if (!localStorage.getItem('auth_token')) return;

    isLoading.value = true;
    error.value = null;

    try {
        const token = ref(localStorage.getItem('auth_token'));
        if(token.value === null) {
            return;
        }
        const data:JwtPayload & {id:string, role:string} = jwtDecode(token.value);
        const userId = data.id;

        if (!userId) {
            throw new Error('User ID not available');
        }

        const { notifications: fetchedNotifications } = await getNotificationsForUser(userId);
           
        userNotifications.value = fetchedNotifications.filter(n => n.roleUser === 'user');
        adminNotifications.value = fetchedNotifications.filter(n => n.roleUser === 'admin');
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            error.value = 'Failed to load notifications';
        } finally {
            isLoading.value = false;
        }
  }

  function markAsRead(notificationId: string, isAdminNotification: boolean) {
    const notificationList = isAdminNotification ? adminNotifications : userNotifications;
    const notification = notificationList.value.find(n => n._id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  function removeNotification(notificationId: string, isAdminNotification: boolean) {
    if (isAdminNotification) {
      adminNotifications.value = adminNotifications.value.filter(n => n._id !== notificationId);
    } else {
      userNotifications.value = userNotifications.value.filter(n => n._id !== notificationId);
    }
  }

  return {
    userNotifications,
    adminNotifications,
    isLoading,
    error,
    userUnreadCount,
    adminUnreadCount,
    fetchNotifications,
    markAsRead,
    removeNotification
  };
});