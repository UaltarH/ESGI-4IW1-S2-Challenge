<template>
    <div>
        <div>
            <h1>Commandes:</h1>
            <CustomizableTable
            :data="data.datas"
            :columns="data.columns"
            :actions="data.actions"
            :numberOfItemsPerPage="data.numberOfItemsPerPage"
            @visualize-item="handleVisualize"
            ></CustomizableTable>
        </div>
        <stepperStatusOrder v-if="orderVisualizer" :statuses="orderVisualizer.status" class="my-4"</stepperStatusOrder>
        <visualizer v-if="orderVisualizer != undefined" :title="'Commande'" :data="orderVisualizer" :buttons="['close', 'invoice']" @createFacture="onCreateFacture" @closeVisualizer="onCloseVisualizer"></visualizer>
    </div>
  </template>
  <script lang="ts" setup>
  import { onMounted, reactive, ref, Ref } from "vue";
  import CustomizableTable from "@/components/common/custom-table/customizable-table.vue";
  import { mongoOrder } from '@/dto/MongoOrder.dto';
  import { OrdersService } from '@/composables/api/orders.service.ts';
  import stepperStatusOrder  from '@/components/common/stepperStatusOrder.vue';
  import visualizer from '@/components/common/visualizer.vue';

  interface orderMappedTable {
    id: string;
    amount: number;
    date: Date;
    email: string;
    trackingNumber: string;
    status: string;
  }
  const datasTable: Ref<orderMappedTable[]> = ref<orderMappedTable[]>([]);
  const originDatas: Ref<mongoOrder[]> = ref<mongoOrder[]>([]);
  const orderVisualizer: Ref<mongoOrder | undefined> = ref<mongoOrder>();

  const data = reactive({
    datas: datasTable,
    columns: [
      { name: "Id", key: "id", sort: true, typeData: "string" },
      { name: "Montant", key: "amount", sort: true, typeData: "string" },
      { name: "Date", key: "date", sort: true, typeData: "date" },
      { name: "Email", key: "email", sort: true, typeData: "string" },
      { name: "Numéro de livraison", key: "trackingNumber", sort: true, typeData: "string" },
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
    //get the last status of the orderusing the date     
    let lastStatus = getTheLatestStatus(order.status);
    return {
      id: order.postgresId,
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

  function onCreateFacture(item: orderMappedTable) {
    alert("Create facture: " + JSON.stringify(item));
  }
  function onCloseVisualizer() {
    orderVisualizer.value = undefined;
  }
  </script>
  