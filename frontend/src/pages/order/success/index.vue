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
              <path v-if="!orderNotFound" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-center text-gray-700">
            {{ statusMessage }}
          </p>
          <p v-if="!orderNotFound" class="text-center text-gray-700">
            Vous pouvez accéder aux détails de votre commande en cliquant sur le bouton ci-dessous.
          </p>
          <div class="flex justify-center">
            <Button v-if="!orderNotFound" @click="goToOrderDetails" class="bg-blue-500 hover:bg-blue-600 text-white">
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
  
  const orderNotFound = ref(false);
  
  const titleText = computed(() => orderNotFound.value ? "Commande introuvable" : "Commande Confirmée");
  const titleClass = computed(() => orderNotFound.value ? "text-red-600" : "text-green-600");
  const iconClass = computed(() => orderNotFound.value ? "text-red-500" : "text-green-500");
  const statusMessage = computed(() => {
    return orderNotFound.value 
      ? "Désolé, nous n'avons pas pu trouver votre commande. Veuillez vérifier vos informations ou contacter notre service client."
      : "Merci pour votre commande ! Nous avons bien reçu votre paiement.";
  });
  
  const checkOrderStatus = async () => {
    const sessionId = route.query.session_id?.toString();
    if (sessionId) {
      try {
        const response = await OrdersService().handleAfterRequestOrder(sessionId, "true");
        if (response.message === "Order not found") {
          orderNotFound.value = true;
        }
        if( response.message === "Order confirmed") {
            cart.$reset();
        }
      } catch (error) {        
        orderNotFound.value = true;
      }
    } else {
      orderNotFound.value = true;
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