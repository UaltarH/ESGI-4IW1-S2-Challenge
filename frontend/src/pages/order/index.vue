<template>
    <div>
      <Card class="m-5">
        <CardHeader>
          <CardTitle>Commande</CardTitle>
        </CardHeader>
        <CardContent>
          <Steppy v-model:step="step" :loading="loading" :finalize="finalize" :backText="'retour'" :nextText="'suivant'" :doneText="'Payer'" :primaryColor1="'#C4997C'" :tabs="stepsInfos" >
            <template #1>
              <shippingStep />
            </template>
            <template #2>
              <invoiceStep />
            </template>
            <template #3>
              <recapStep />
            </template>            
          </Steppy>
        </CardContent>        
      </Card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Steppy } from 'vue3-steppy';
  import shippingStep from './steps/shipping.vue';
  import invoiceStep from './steps/invoice.vue';
  import recapStep from './steps/recap.vue';
  
  const step = ref<number>(1);
  const loading = ref<boolean>(false);
  const stepsInfos: {title: string, iconSuccess: string | null, isValid: boolean}[] = [
    {title: 'Livraison', iconSuccess: null, isValid: true},
    {title: 'Facturation', iconSuccess: null, isValid: true},
    {title: 'Recapitulation', iconSuccess: null, isValid: true},
  ]
  
  const finalize = (): void => {
    loading.value = true;
    // Ajoutez votre logique de finalisation ici, puis définissez loading à false quand terminé
    setTimeout(() => {
      loading.value = false;
      console.log("Finalization logic executed");
    }, 2000);
  };
  </script>
