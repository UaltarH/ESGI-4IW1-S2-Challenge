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
        <div v-for="order in orders" :key="order._id" class="flex flex-col justify-start items-start px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
          <div class="w-full flex flex-col justify-start items-start space-y-8 p-6 bg-white rounded-lg shadow-md dark:bg-dark-blue-dark">
            <div class="w-full flex flex-row align-middle justify-between items-center">
              <span class="text-xl dark:text-white font-semibold text-gray-800">
                Commande {{ order.orderNumber }}
              </span>
              <stepperStatusOrder :statuses="order.status" class="my-4"</stepperStatusOrder>
              <button 
                @click="onCreateFacture(order)" 
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              >
                Générer la facture
              </button>
            </div>
            <div class="flex justify-start items-start flex-col space-y-2">
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Date: </span>{{ new Date(order.date).toLocaleDateString() }}</p>
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Total: </span>{{ order.payment.amount.toFixed(2) }}€</p>
              <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Statut: </span>{{ order.status.sort((a, b) => new Date(b.date) - new Date(a.date))[0].status }}</p>
              <p v-if="order.shipping && order.shipping.trackingNumber" class="text-sm dark:text-white leading-none text-gray-800">
                <span class="dark:text-gray-400 text-gray-300">Livraison No. </span>
                {{ order.shipping.trackingNumber }}
              </p>
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
      <div v-if="totalPages !== 0" class="flex justify-center items-center py-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700">Précédent</button>
        <span class="px-4">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import AccountSideMenu from "@/components/AccountSideMenu.vue";
import { OrdersService } from "@/composables/api/orders/orders.service";
import { mongoOrder } from '@/dto/MongoOrder.dto';
import { useUserStore } from "@/stores/user.ts";
import { usePdfGenerator } from '@/composables/order/generatePdfInvoice';
import stepperStatusOrder  from '@/components/common/stepperStatusOrder.vue';

const orders = ref<mongoOrder[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const userStore = useUserStore();

const { generatePdfFromOrder } = usePdfGenerator();

const sortOrdersByDate = (orders: mongoOrder[]) => {
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const fetchOrders = async (page: number = 1) => {
  try {
    const response = await OrdersService().getSpecificMongoOrder(userStore.user.id, page);
    orders.value = sortOrdersByDate(response.orders);
    currentPage.value = response.currentPage;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error(error);
  }
};

async function onCreateFacture(item: mongoOrder) {    
  generatePdfFromOrder(item);    
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchOrders(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchOrders(currentPage.value - 1);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

