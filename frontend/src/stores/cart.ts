import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import { CartItem} from "@/dto/cart.dto.ts";
import { ref, computed, watch } from "vue";
import { uuid } from 'vue-uuid'
import { useCart } from "@/composables/api/useCart.ts";
import {CartItemResponse} from "@/dto/api/cartItem.dto.ts";

const { getCartByUserId, createCart } = useCart();

export const useCartStore = defineStore('cart', () => {
  const rawItems = ref([] as CartItem[]);
  const id = computed(() => {
    if( localStorage.getItem('cartId') === null) {
      const id = uuid.v4();
      localStorage.setItem('cartId', id);
      return id;
    } else return localStorage.getItem('cartId');
  });
  const cartItems = computed(() => {
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
  async function init() {
    const userStore = useUserStore();
    localStorage.removeItem('cartId');
    console.log('User connected');
    // get cart from db, if no cart check local storage
    await getCartByUserId(userStore.user.id).then((res) => {
      if(res.status === 200) {
        res.json().then((data) => {
          console.log('Cart from db');
          console.log(data);
          const cartItemsFromDb: CartItem[] = data.cart.Cart_items.map((item: CartItemResponse) => {
            return {
              id: item.id,
              postgresId: item.ProductId,
              name: item.Product.name,
              description: item.Product.description,
              size: item.Product["size"] ? item.Product["size"] : 'N/A',
              price: item.Product.price.toFixed(2),
              quantity: item.quantity,
            } as unknown as CartItem;
          });
          console.log(cartItemsFromDb);
          rawItems.value = cartItemsFromDb;
          localStorage.setItem('cartId', data.cart.id);
        });
      } else {
        console.log('No cart in db getting cart from local storage');
        if(localStorage.getItem('cart')) {
          rawItems.value = JSON.parse(localStorage.getItem('cart') || '[]');
          createCart(id.value!, userStore.user.id, rawItems.value).then((res) => {
            if(res.status === 201) {
              localStorage.setItem('cartId', id.value!);
            }
          });
        }
        else {
          console.log('No cart in local storage');
          createCart(id.value!, userStore.user.id, []).then((res) => {
            if(res.status === 201) {
              console.log('Cart created in db');
              localStorage.setItem('cartId', id.value!);
            }
          });
        }
      }
    });
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
    init,
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
