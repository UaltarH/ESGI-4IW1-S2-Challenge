<template>
    <div>
        <Card class="m-5">
            <CardHeader>
                <CardTitle>Etapes de la commande</CardTitle>
            </CardHeader>
            <CardContent>
                <Steppy v-model:step="step" @update:step="pageChange" :loading="loading" :finalize="finalize" :backText="'retour'" :nextText="'suivant'" :doneText="'Payer'" :primaryColor1="'#C4997C'" :tabs="stepsInfos" >
                    <template #1>
                    <shippingStep :infoShipping="shippingInfo" @saveInfoShipping="handleShippingSave" />
                    </template>
                    <template #2>
                    <invoiceStep :infoShipping="shippingInfo" :infoInvoice="invoiceInfo" @saveInfoInvoice="handleInvoiceSave"/>
                    </template>
                    <template #3>
                    <recapStep />
                    </template>            
                </Steppy>
                <Accordion type="single" collapsible>
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
  import {shipping} from '@/dto/shipping.dto';
  import {invoice} from '@/dto/invoice.dto';
  import cartContent from "@/components/cart/CartContent.vue";
  
  const step = ref<number>(1);
  const loading = ref<boolean>(false);
  const stepsInfos: Ref<{title: string, iconSuccess: string | null, isValid: boolean}[]> = ref([
    {title: 'Livraison', iconSuccess: null, isValid: false},
    {title: 'Facturation', iconSuccess: null, isValid: false},
    {title: 'Payement', iconSuccess: null, isValid: true},
  ]);
  const shippingInfo = ref<shipping | null>(null);
  const invoiceInfo = ref<invoice | null>(null);

  const handleShippingSave = (shippingInfoInput: shipping): void => {
    shippingInfo.value = shippingInfoInput;

    stepsInfos.value[0].isValid = true;
  };
  const handleInvoiceSave = (invoiceInfoInput: invoice): void => {
    invoiceInfo.value = invoiceInfoInput;
    console.log(invoiceInfo.value);
    stepsInfos.value[1].isValid = true;
  };

  const pageChange = (): void => {
    let index = step.value-1;
    if(index != 2){
        stepsInfos.value[step.value-1].isValid = false;
    }
  };
  
  const finalize = (): void => {
    loading.value = true;
    // Ajoutez votre logique de finalisation ici, puis définissez loading à false quand terminé
    setTimeout(() => {
      loading.value = false;
      console.log("Finalization logic executed");
    }, 2000);
  };
  </script>
