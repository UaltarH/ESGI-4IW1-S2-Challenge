<template>
    <div class="container mx-auto px-4 py-8">
      <Card class="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle class="text-2xl font-bold text-center" :class="titleClass">
            {{ titleText }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex justify-center">
            <svg class="w-24 h-24" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path v-if="orderStatus !== 'not_found'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-center text-gray-700">
            {{ statusMessage }}
          </p>
          <p v-if="orderStatus !== 'not_found'" class="text-center text-gray-700">
            Vous pouvez accéder aux détails de votre commande en cliquant sur le bouton ci-dessous.
          </p>
          <div class="flex justify-center">
            <Button v-if="orderStatus !== 'not_found'" @click="goToOrderDetails" class="bg-blue-500 hover:bg-blue-600 text-white">
              Voir les détails de la commande
            </Button>
            <Button v-else @click="goToShop" class="bg-blue-500 hover:bg-blue-600 text-white">
              Retourner à la boutique
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { OrdersService } from '@/composables/api/orders/orders.service.ts';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { useCartStore } from "@/stores/cart.ts";
  
  const route = useRoute();
  const router = useRouter();
  const cart = useCartStore();
  
  const orderStatus = ref('pending');
  
  const titleText = computed(() => {
    switch(orderStatus.value) {
      case 'not_found': return "Commande introuvable";
      case 'already_confirmed': return "Commande déjà confirmée";
      default: return "Commande Confirmée";
    }
  });
  
  const titleClass = computed(() => {
    return orderStatus.value === 'not_found' ? "text-red-600" : "text-green-600";
  });
  
  const iconClass = computed(() => {
    return orderStatus.value === 'not_found' ? "text-red-500" : "text-green-500";
  });
  
  const statusMessage = computed(() => {
    switch(orderStatus.value) {
      case 'not_found':
        return "Désolé, nous n'avons pas pu trouver votre commande. Veuillez vérifier vos informations ou contacter notre service client.";
      case 'already_confirmed':
        return "Cette commande a déjà été confirmée précédemment. Merci pour votre achat !";
      default:
        return "Merci pour votre commande ! Nous avons bien reçu votre paiement.";
    }
  });
  
  const checkOrderStatus = async () => {
    const sessionId = route.query.session_id?.toString();
    if (sessionId) {
      try {
        const response = await OrdersService().handleAfterRequestOrder(sessionId, "true");
        if (response.message === "Order not found") {
          orderStatus.value = 'not_found';
        } else if (response.message === "Order confirmed") {
          orderStatus.value = 'confirmed';
          cart.$reset();
        } else if (response.message === "Order already confirmed") {
          orderStatus.value = 'already_confirmed';
        }
      } catch (error) {
        orderStatus.value = 'not_found';
      }
    } else {
      orderStatus.value = 'not_found';
    }
  };
  
  const goToOrderDetails = () => {
    router.push({ name: 'account-orders' });
  };
  
  const goToShop = () => {
    router.push({ name: 'products' });
  };
  
  onMounted(checkOrderStatus);
  </script>