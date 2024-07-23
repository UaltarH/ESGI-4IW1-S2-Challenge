<template>
    <div>
        <div>
            <h1>Commandes:</h1>
            <CustomizableTable
            :data="data.datas"
            :columns="data.columns"
            :actions="data.actions"
            :numberOfItemsPerPage="data.numberOfItemsPerPage"
            :canDeleteAll="false"
            @visualize-item="handleVisualize"
            ></CustomizableTable>
        </div>
        <stepperStatusOrder v-if="orderVisualizer" :statuses="orderVisualizer.status" class="my-4"</stepperStatusOrder>

        <visualizer
          class="mt-4"
          v-if="orderVisualizer != undefined"
          :title="'Commande'"
          :data="orderVisualizer"
          :buttons="['close', 'invoice']"
          :fields="[
            'orderNumber', 
            'date', 
            'user', 
            'orderItems', 
            'payment', 
            'shipping', 
          ]"
          :labels="{
            orderNumber: 'Numéro de Commande',
            date: 'Date',
            user: 'Utilisateur',
            'user.userId': 'Identifiant Utilisateur',
            'user.firstname': 'Prénom',
            'user.lastname': 'Nom de Famille',
            'user.email': 'Adresse Email',
            'user.phone': 'Numéro de Téléphone',
            orderItems: 'Articles Commandés',
            'orderItems.orderItemId': 'Identifiant de l\'Article de la Commande',
            'orderItems.productId': 'Identifiant du Produit',
            'orderItems.productName': 'Nom du Produit',
            'orderItems.quantity': 'Quantité',
            'orderItems.price': 'Prix',
            payment: 'Paiement',
            'payment.paymentId': 'Identifiant du Paiement',
            'payment.stripePaymentId': 'Identifiant Stripe',
            'payment.amount': 'Montant',
            shipping: 'Expédition',
            'shipping.shippingId': 'Identifiant de l\'Expédition',
            'shipping.shippingMethod': 'Méthode d\'Expédition',
            'shipping.trackingNumber': 'Numéro de Suivi',
            'shipping.address': 'Adresse',
            'shipping.city': 'Ville',
            'shipping.zipcode': 'Code Postal',
            'shipping.country': 'Pays',
          }"
          @closeVisualizer="onCloseVisualizer"
          @createFacture="onCreateFacture"
        />

        <p v-if="isGenerating">Génération en cours...</p>
        <p v-if="error">{{ error }}</p>
    </div>
  </template>
  <script lang="ts" setup>
  import { onMounted, reactive, ref, Ref } from "vue";
  import CustomizableTable from "@/components/common/custom-table/customizable-table.vue";
  import { mongoOrder } from '@/dto/MongoOrder.dto';
  import { OrdersService } from '@/composables/api/orders/orders.service';
  import stepperStatusOrder  from '@/components/common/stepperStatusOrder.vue';
  import visualizer from '@/components/common/visualizer.vue';
  import { usePdfGenerator } from '@/composables/order/generatePdfInvoice';


  interface orderMappedTable {
    id: string;
    orderNumber: string;
    amount: number;
    date: Date;
    email: string;
    trackingNumber: number;
    status: string;
  }
  const { generatePdfFromOrder, isGenerating, error } = usePdfGenerator();

  const datasTable: Ref<orderMappedTable[]> = ref<orderMappedTable[]>([]);
  const originDatas: Ref<mongoOrder[]> = ref<mongoOrder[]>([]);
  const orderVisualizer: Ref<mongoOrder | undefined> = ref<mongoOrder>();

  const data = reactive({
    datas: datasTable,
    columns: [
      { name: "Commande n°", key: "orderNumber", sort: true, typeData: "string" },
      { name: "Montant", key: "amount", sort: true, typeData: "string" },
      { name: "Date", key: "date", sort: true, typeData: "date" },
      { name: "Email", key: "email", sort: true, typeData: "string" },
      { name: "Numéro de livraison", key: "trackingNumber", sort: true, typeData: "number" },
      { name: "Status", key: "status", sort: true, typeData: "string" },
    ],
    actions: { edit: false, delete: false, visualize: true },
    numberOfItemsPerPage: [5, 10, 15, 20],
  });

  onMounted(() => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    try {
      const response = await OrdersService().getAllMongoOrders();
        originDatas.value = response.orders;
        datasTable.value = response.orders.map(mappOrderToTable);
    } catch (error) {
      console.error(error);
    }
  }

  const mappOrderToTable = (order: mongoOrder): orderMappedTable => {       
    let lastStatus = getTheLatestStatus(order.status);
    return {
      id: order.postgresId,
      orderNumber: order.orderNumber,
      amount: order.payment.amount,
      date: order.date,
      email: order.user.email,
      trackingNumber: order.shipping.trackingNumber,
      status: lastStatus,
    }
  }

  const getTheLatestStatus = (statuses: { statusId: string, status: string, date: Date, _id: string}[]):string => {
    if (statuses.length === 0) {
        return '';
    }
    let latestStatus = statuses[0];
    
    statuses.forEach(status => {
        if (new Date(status.date) > new Date(latestStatus.date)) {
        latestStatus = status;
        }
    });

    return latestStatus.status;  
  }
  
  function handleVisualize(item: orderMappedTable) {
    let orderOrigin = originDatas.value.find(order => order.postgresId === item.id);
    if (orderOrigin !== undefined) {
      orderVisualizer.value = orderOrigin;      
    };
  }

  async function onCreateFacture(item: mongoOrder) {    
    generatePdfFromOrder(item);    
  }

  function onCloseVisualizer() {
    orderVisualizer.value = undefined;
  }
  </script>
  