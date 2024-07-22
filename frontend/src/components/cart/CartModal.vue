<template>
  <div v-if="props.show" class="overflow-hidden w-full h-full">
    <div class="cart-modal--mask" @click="handleClose"></div>
    <div class="cart-modal">
      <header class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Panier</h2>
        <button type="button" @click="handleClose" class="text-2xl">&times;</button>
      </header>
      <cartContent></cartContent>
      <div class="cart-modal--total">           
        <div class="cart-modal--total-sub"><h2>Total:</h2><p>{{ cart.cartTotal }} €</p></div>
      </div>
      <button class="btn btn--primary justify-center" type="submit" @click="handlePurchase" aria-label="commander">Commander</button>
      <button class="btn btn--ghost justify-center" type="button" @click="handlePurchase" aria-label="voir le panier">Voir le panier</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCartStore } from "@/stores/cart.ts";
import { onMounted, onUnmounted } from "vue";
import cartContent from "@/components/cart/CartContent.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.ts";

const router = useRouter();
const emits = defineEmits(["close"]);
const cart = useCartStore();
const userStore = useUserStore();

onMounted(() => {
  if(cart.cartItems.length === 0) {
    if(localStorage.getItem('cartId')) {
      cart.getGuestCartItems(localStorage.getItem('cartId') as string);
    } else if (!!userStore.user.id) {
      cart.mergeOrLinkCart();
    }
  }
})
onUnmounted(() => {
  emits("close");
});
const props = defineProps({
  show: Boolean,
});

function handleClose() {
  emits("close")
}
function handlePurchase() {
  router.push({name: 'order'}).then(()=> {
    handleClose();
  });
}
</script>