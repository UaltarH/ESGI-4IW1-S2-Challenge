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
              <path v-if="orderStatus === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else-if="orderStatus === 'confirmed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-center text-gray-700">
            {{ statusMessage }}
          </p>
          <div v-if="orderStatus === 'cancelled'" class="bg-gray-100 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Raison possible :</p>
            <p class="font-semibold">{{ cancellationReason }}</p>
          </div>         
          <div class="flex justify-center space-x-4">
            <Button v-if="orderStatus === 'cancelled'" @click="retryOrder" class="bg-blue-500 hover:bg-blue-600 text-white">
              Réessayer la commande
            </Button>
            <Button v-if="orderStatus === 'cancelled'" @click="contactSupport" variant="outline" class="border-gray-300 text-gray-700 hover:bg-gray-100">
              Contacter le support
            </Button>
            <Button v-if="orderStatus === 'confirmed'" @click="viewOrderDetails" class="bg-blue-500 hover:bg-blue-600 text-white">
              Voir les détails de la commande
            </Button>
            <Button v-if="orderStatus === 'not_found'" @click="goToShop" class="bg-blue-500 hover:bg-blue-600 text-white">
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
  
  const route = useRoute();
  const router = useRouter();
  
  const orderStatus = ref('pending');
  const cancellationReason = ref("Paiement refusé ou session expirée");
  
  const titleText = computed(() => {
    switch(orderStatus.value) {
      case 'cancelled': return 'Commande Annulée';
      case 'confirmed': return 'Commande deja Confirmée';
      case 'not_found': return 'Commande Introuvable';
      default: return 'Statut de la Commande';
    }
  });
  
  const titleClass = computed(() => {
    switch(orderStatus.value) {
      case 'cancelled': return 'text-red-600';
      case 'confirmed': return 'text-yellow-600';
      default: return 'text-yellow-600';
    }
  });
  
  const iconClass = computed(() => {
    switch(orderStatus.value) {
      case 'cancelled': return 'text-red-500';
      case 'confirmed': return 'text-yellow-500';
      default: return 'text-yellow-500';
    }
  });
  
  const statusMessage = computed(() => {
    switch(orderStatus.value) {
      case 'cancelled': 
        return 'Nous sommes désolés, mais votre commande n\'a pas pu être finalisée.';
      case 'confirmed':
        return 'Votre commande a deja été confirmée.';
      case 'not_found':
        return 'Désolé, nous n\'avons pas pu trouver votre commande. Veuillez vérifier vos informations.';
      default:
        return 'Nous vérifions le statut de votre commande. Veuillez patienter...';
    }
  });
  
  onMounted(async () => {
    const sessionId = route.query.session_id?.toString();
    if (sessionId) {
      try {
        const response = await OrdersService().handleAfterRequestOrder(sessionId, "false");
        if (response.message === "Order cancel") {
          orderStatus.value = 'cancelled';
        } else if (response.message === "Order already confirmed") {
          orderStatus.value = 'confirmed';

        } else if (response.message === "Order not found") {
          orderStatus.value = 'not_found';
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        orderStatus.value = 'not_found';
      }
    } else {
      orderStatus.value = 'not_found';
    }
  });
  
  const retryOrder = () => {
    router.push({ name: 'order' });
  };
  
  const contactSupport = () => {
    router.push('/contact');
  };
  
  const viewOrderDetails = () => {
    router.push({ name: 'account-orders' });
  };
  
  const goToShop = () => {
    router.push({ name: 'products' });
  };
  </script>