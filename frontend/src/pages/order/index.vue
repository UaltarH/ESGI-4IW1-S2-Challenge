<template>
  <div v-if="cart.cartItems.length > 0" class="order-recap">
    <Card class="m-5 dark:bg-dark-blue dark:border-gray-700 dark:text-white">
      <CardHeader class="dark:bg-dark-blue-dark rounded-tl-lg rounded-tr-lg">
        <CardTitle>Étapes de la commande</CardTitle>
      </CardHeader>
      <CardContent>
        <Steppy v-model:step="step" @update:step="pageChange" :loading="loading" :finalize="finalize"
          :backText="'retour'" :nextText="'suivant'" :doneText="'Payer'" :primaryColor1="'#C4997C'" :tabs="stepsInfos">
          <template #1>
            <shippingStep :infoShipping="shippingInfo" @saveInfoShipping="handleShippingSave" />
          </template>
          <template #2>
            <invoiceStep :infoShipping="shippingInfo" :infoInvoice="invoiceInfo" @saveInfoInvoice="handleInvoiceSave" />
          </template>
          <template #3>
            <recapStep />
          </template>
        </Steppy>
        <Accordion type="single" collapsible :default-value="'item-1'" class="lg:px-[60px]">
          <AccordionItem value="item-1">
            <AccordionTrigger>Récapitulatif de la commande</AccordionTrigger>
            <AccordionContent>
              <cartContent></cartContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
  <div v-else>
    <Card class="m-5">
      <CardHeader>
        <CardTitle>Votre panier est vide</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vous n'avez pas d'article dans votre panier</p>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Steppy } from 'vue3-steppy';

import shippingStep from './steps/shipping.vue';
import invoiceStep from './steps/invoice.vue';
import recapStep from './steps/recap.vue';
import { shipping } from '@/dto/shipping.dto';
import { invoice } from '@/dto/invoice.dto';
import cartContent from "@/components/cart/CartContent.vue";
import { useCartStore } from "@/stores/cart.ts";
import { OrdersService } from '@/composables/api/orders/orders.service.ts';
import { loadStripe } from '@stripe/stripe-js';
import { createOrder } from '@/composables/api/orders/dto/inputRequest/createOrder.dto';
import { useUserStore } from "@/stores/user.ts";

const cart = useCartStore();
const userStore = useUserStore();

const step = ref<number>(1);
const loading = ref<boolean>(false);
const stepsInfos: Ref<{ title: string, iconSuccess: string | null, isValid: boolean }[]> = ref([
  { title: 'Livraison', iconSuccess: null, isValid: false },
  { title: 'Facturation', iconSuccess: null, isValid: false },
  { title: 'Payement', iconSuccess: null, isValid: true },
]);
const shippingInfo = ref<shipping | null>(null);
const invoiceInfo = ref<invoice | null>(null);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const handleShippingSave = (shippingInfoInput: shipping): void => {
  shippingInfo.value = shippingInfoInput;

  stepsInfos.value[0].isValid = true;
};
const handleInvoiceSave = (invoiceInfoInput: invoice): void => {
  invoiceInfo.value = invoiceInfoInput;
  stepsInfos.value[1].isValid = true;
};

const pageChange = (): void => {
  let index = step.value - 1;
  if (index != 2) {
    stepsInfos.value[step.value - 1].isValid = false;
  }
};

const finalize = (): void => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    checkout();
  }, 2000);
};

const checkout = async () => {
  try {
    const bodyRequest: createOrder = {
      userId: userStore.user.id,
      date: new Date(),
      total: Number(cart.cartTotal),
      orderItems: cart.cartItems.map((item) => {
        return {
          productId: item.postgresId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        };
      }),
      shipping: shippingInfo.value as shipping,
    };
    const response = await OrdersService().createOrder(bodyRequest);
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });

    if (error) {
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

</script>
<style>
.order-recap .steppy-pane {
  padding: 0;
  background-color: transparent;
}

.order-recap .steppy-item-counter {
  @apply dark:bg-dark-blue-dark;
}
</style>