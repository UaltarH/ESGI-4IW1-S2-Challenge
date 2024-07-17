import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import { CartItem} from "@/dto/cart.dto.ts";
import { ref, computed } from "vue";

export const useCartStore = defineStore('cart', () =>{
  const rawItems = ref([] as CartItem[]);
  const cartItems = computed(() => {
    if(localStorage.getItem('cart')) {
      rawItems.value = JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return rawItems.value;
  });
  const cartTotal = computed(() => {
    return cartItems.value.reduce((acc, item) =>
        acc + (item.price * item.quantity), 0
    ).toFixed(2);
  });
  const vatAmount = computed(() => {
    return (parseFloat(cartTotal.value) * 0.2 / 1.2).toFixed(2);
  });
  function itemTotalAmount(item: CartItem) {
    return (item.price * item.quantity).toFixed(2);
  }
  async function addToCart(item: CartItem) {
    let existingItem = rawItems.value.find((it) => it.id === item.id)
    if(existingItem) {
      await updateQuantity(item.id, existingItem.quantity + item.quantity);
    }
    else rawItems.value.push(item);
    // TODO : decrement stock in mongoDB
  }
  async function updateQuantity(id: string, quantity: number) {
    const item = rawItems.value.find((item) => item.id === id)
    if (item) {
      item.quantity = quantity;
      if(item.quantity <= 0) {
        await removeFromCart(id)
      }
      // TODO : decrement stock in mongoDB
    } else {
      console.error('Item not found in cart');
    }
  }
  async function removeFromCart(id: string) {
    rawItems.value = rawItems.value.filter((item) => item.id !== id)
  }
  async function purchase() {
    const userStore = useUserStore();

    if (!userStore.user.id) {
      throw new Error('User not logged in')
    }

    const items = cartItems.value;

    if (items.length === 0) {
      throw new Error('Cart is empty')
    }

    console.log(`User ${userStore.user.id} purchased ${items.length} items for a total of ${ cartTotal}`)
    $reset();
  }
  function $reset() {
    rawItems.value = [] as CartItem[];
  }
  return {
    rawItems,
    cartItems,
    vatAmount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    purchase,
    itemTotalAmount,
    $reset,
  }
});
// Rechargement à chaud HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
