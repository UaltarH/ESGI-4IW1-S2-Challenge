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
    return rawItems.value.reduce((acc, item) => {
      const existingItem = acc.find((it) => it.name === item.name)

      if (!existingItem) {
        acc.push({ id: item.id, name: item.name, size: item.size, description: item.description, price: item.price, quantity: item.quantity })
      } else {
        existingItem.quantity++;
      }

      return acc;
    }, [] as CartItem[])
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
    rawItems.value.push(item)
  }
  async function updateQuantity(id: string, quantity: number) {
    const item = rawItems.value.find((item) => item.id === id)
    if (item) {
      item.quantity = quantity;
      if(item.quantity <= 0) {
        await removeFromCart(id)
      }
    }
  }
  async function removeFromCart(id: string) {
    rawItems.value.splice(rawItems.value.findIndex((item) => item.id === id), 1)
  }
  async function purchase() {
    const user = useUserStore();

    if (!user.name) {
      throw new Error('User not logged in')
    }

    const items = cartItems.value;

    if (items.length === 0) {
      throw new Error('Cart is empty')
    }

    console.log(`User ${user.name} purchased ${items.length} items for a total of ${ cartTotal}`)
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
