<template>
  <div class="flex flex-col lg:flex-row py-12">
    <div class="tile">
      <svg width="90" height="90" viewBox="0 0 24 24" class="avatar avatar--small stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5777 3.38197L17.5777 4.43152C19.7294 5.56066 20.8052 6.12523 21.4026 7.13974C22 8.15425 22 9.41667 22 11.9415V12.0585C22 14.5833 22 15.8458 21.4026 16.8603C20.8052 17.8748 19.7294 18.4393 17.5777 19.5685L15.5777 20.618C13.8221 21.5393 12.9443 22 12 22C11.0557 22 10.1779 21.5393 8.42229 20.618L6.42229 19.5685C4.27063 18.4393 3.19479 17.8748 2.5974 16.8603C2 15.8458 2 14.5833 2 12.0585V11.9415C2 9.41667 2 8.15425 2.5974 7.13974C3.19479 6.12523 4.27063 5.56066 6.42229 4.43152L8.42229 3.38197C10.1779 2.46066 11.0557 2 12 2C12.9443 2 13.8221 2.46066 15.5777 3.38197Z" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <h1>Mes commandes</h1>
      <AccountSideMenu></AccountSideMenu>
    </div>
    <div class="flex-1 overflow-auto max-h-screen">
      <div class="flex flex-col justify-start items-start">
        <div v-for="order in orders" :key="order._id" class="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
          <div class="w-full flex flex-col justify-start items-start space-y-8">
            <h3 class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">Commande {{ order._id }}</h3>
            <div class="flex justify-start items-start flex-col space-y-2">
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Date: </span>{{ new Date(order.date).toLocaleDateString() }}</p>
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Total: </span>{{ order.totalPrice }}€</p>
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Statut: </span>{{ order.status.sort((a, b) => new Date(b.date) - new Date(a.date))[0].status }}</p>
            </div>
            <div class="w-full">
              <h4 class="text-lg dark:text-white xl:text-xl font-semibold leading-6 text-gray-800">Articles</h4>
              <div v-for="item in order.orderItems" :key="item.orderItemId" class="flex justify-between items-start w-full py-2 border-b border-gray-200">
                <p class="text-base dark:text-white xl:text-lg leading-6">{{ item.productName }}</p>
                <p class="text-base dark:text-white xl:text-lg leading-6">{{ item.quantity }} x {{ item.price }}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import AccountSideMenu from "@/components/AccountSideMenu.vue";
import { OrdersService } from "@/composables/api/orders.service";
import { mongoOrder } from '@/dto/MongoOrder.dto';
import { useUserStore } from "@/stores/user.ts";

const orders = ref<mongoOrder[]>([]);
const userStore = useUserStore();

const fetchOrders = async () => {
  try {
    const response = await OrdersService().getSpecificMongoOrder(userStore.user.id)
    orders.value = response.orders;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>
