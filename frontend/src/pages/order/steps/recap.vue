<template>
    
    <div>
        <div class="bg-white dark:bg-dark-blue-dark px-6 py-8 rounded-lg dark:text-white">
            <div class="flex justify-between items-center mb-4">
              <span class="font-semibold">Panier ({{ cart.cartItems.length }})</span>
              <span class="font-semibold">{{ cart.cartTotal }} €</span>
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="flex justify-between items-center">
                <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 17" aria-labelledby="Delivery" class="icon_2DB22" data-testid="icon-Delivery" fill="currentColor" height="16" version="1.1" width="16">
                        <path d="m20.265 5.368-.598-.199-1.936-3.228A4.02 4.02 0 0 0 14.301 0H2C.897 0 0 .897 0 2v10.677l3.04 1.216C3.238 15.636 4.706 17 
                        6.5 17c1.758 0 3.204-1.309 3.449-3h3.102c.245 1.691 1.691 3 3.449 3 1.758 0 3.204-1.309 3.449-3H21c1.103 0 2-.897 
                        2-2V9.162c0-1.725-1.1-3.249-2.735-3.794M6.5 15a1.5 1.5 0 1 1-.001-2.999A1.5 1.5 0 0 1 6.5 15m10 0a1.5 1.5 0 1 1-.001-2.999A1.5 
                        1.5 0 0 1 16.5 15m4.5-3h-1.351a3.495 3.495 0 0 0-3.149-2 3.495 3.495 0 0 0-3.149 2H9.649A3.495 3.495 0 0 0 6.5 10c-1.345 0-2.502.771-3.088 
                        1.888L2 11.324V2h12.302c.698 0 1.355.372 1.715.971l2.316 3.86 1.299.435A1.996 1.996 0 0 1 21 9.162z">
                        </path>
                    </svg>
                  Frais de livraison
                </span>
                <span class="text-green-600">{{4.99}} €</span>
              </div>              
            </div>
            
            <div class="border-t border-gray-200 pt-4 mb-4">
              <div class="flex justify-between items-center font-semibold">
                <span>TOTAL</span>
                <span class="text-red-600">{{ calculateTotal() }} €</span>
              </div>              
            </div>
          </div>  
    </div>
</template>
<script lang="ts" setup>
import { useCartStore } from "@/stores/cart.ts";


const cart = useCartStore();

const calculateTotal = () => {

    return (Number(cart.cartTotal) + 4.99).toFixed(2) ;
}

</script>