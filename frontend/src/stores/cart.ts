import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import { CartItem} from "@/dto/cart.dto.ts";
import { ref, computed, watch } from "vue";
import { uuid } from 'vue-uuid'
// import { useCart } from "@/composables/api/useCart.ts";

// const { getCart } = useCart();

export const useCartStore = defineStore('cart', () =>{
  const rawItems = ref([] as CartItem[]);
  const id = ref(uuid.v4());
  const cartItems = computed(() => {
    // const userStore = useUserStore();
    // if (userStore.user.id) {
    //   const res = await getCart(userStore.user.id).then((res) => res.json());
    // TODO : fetch cart from postgres
    // }
    if (localStorage.getItem('cart')) {
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

  watch(rawItems, (newItems) => {
    console.log('Cart updated');
    localStorage.setItem("cart", JSON.stringify(newItems));
  }, { deep: true });

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
    id,
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
