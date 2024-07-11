<template>
  <div v-if="props.show" class="overflow-hidden w-full h-full">
    <div class="cart-modal--mask" @click="handleClose"></div>
    <div class="cart-modal">
      <header class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Panier</h2>
        <button type="button" @click="handleClose" class="text-2xl">&times;</button>
      </header>
      <div class="cart-modal--content" :class="cart.cartItems.length === 0 ? 'items-center justify-center' : ''">
        <p v-if="cart.cartItems.length === 0" class="text-gray-400">Le panier est vide :'(</p>
        <ul v-else>
          <li v-for="item in cart.cartItems" :key="item.id" class="cart-modal--item">
            <div>
              <img src="https://placehold.co/100X100" :alt="item.name"/>
              <label :for="item.id" class="cart-modal--item-name">{{ item.name }}</label>
            </div>
            <div class="flex flex-col justify-start items-start gap-2">
              <p class="cart-modal--item-desc">{{ descriptionShortener(item.description) }}</p>
              <p>Taille : <b>{{ item.size }}</b></p>
              <input-number :id="item.id" :name="item.id" :value="item.quantity" :min=0 @update:model-value="args => handleQuantityChange(item.id, args)" class="cart-modal--item-qty"/>
            </div>
            <div class="flex flex-col justify-between">
              <div class="cart-modal--item-prices">
                <div class="cart-modal--item-price text-gray-400" v-if="item.quantity > 1">
                  <span><small>prix unitaire : </small></span>
                  <span><b>{{ item.price }} €</b></span>
                </div>
                <div class="cart-modal--item-price">
                  <span><small>montant total : </small></span>
                  <span><b>{{ cart.itemTotalAmount(item) }} €</b></span>
                </div>
              </div>
              <button type="button" class="self-end" aria-label="delete button" @click="handleDeleteItem(item)">
                <svg width="24" height="24" viewBox="0 0 24 24" class="fill:primary hover:fill-danger dark:fill-white dark:hover:fill-danger" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"/>
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="cart-modal--total">
        <div class="cart-modal--total-sub"><h2>Sous-total:</h2><p>{{ cart.cartTotal }} €</p> </div>
        <div class="cart-modal--total-vat"><h2>TVA incluse:</h2><p>{{ cart.vatAmount }} €</p></div>
        <div class="cart-modal--total-total"><h2>Total:</h2><p>{{ cart.cartTotal }} €</p></div>
      </div>
      <button class="btn btn--primary justify-center" type="submit" @click="handlePurchase" aria-label="commander">Commander</button>
      <button class="btn btn--ghost justify-center" type="button" @click="handlePurchase" aria-label="voir le panier">Voir le panier</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCartStore } from "@/stores/cart.ts";
import { onUnmounted } from "vue";
import {CartItem} from "@/dto/cart.dto.ts";
import InputNumber from "@/components/ui/number-field/InputNumber.vue";

onUnmounted(() => {
  emits("close");
});
const props = defineProps({
  show: Boolean,
});
const emits = defineEmits(["close"]);
const cart = useCartStore();

cart.$subscribe((mutation, state) => {
  localStorage.setItem("cart", JSON.stringify(state.rawItems));
}, { detached: true });

function handleClose() {
  emits("close")
}
function handleQuantityChange(id: string, quantity: number) {
  cart.updateQuantity(id, quantity);
}
function handleDeleteItem(item: CartItem) {
  cart.removeFromCart(item.id);
}
function handlePurchase() {

}
function descriptionShortener(description: string) {
  return description.length > 50 ? description.slice(0, 50) + "..." : description;
}
</script>