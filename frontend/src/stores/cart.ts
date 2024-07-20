import { acceptHMRUpdate, defineStore } from 'pinia'
import { useUserStore } from './user'
import { CartItem } from "@/dto/cart.dto.ts";
import { computed, ref, watch } from "vue";
import { uuid } from 'vue-uuid'
import { useCart } from "@/composables/api/useCart.ts";
import {CartItemResponse} from "@/dto/api/cartItem.dto.ts";

const { getCartByUserId, createCart, updateCart } = useCart();

export const useCartStore = defineStore('cart', () => {
  const rawItems = ref([] as CartItem[]);
  const id = computed(() => {
    if( localStorage.getItem('cartId') === null) {
      const newId = uuid.v4();
      localStorage.setItem('cartId', newId);
      return newId;
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
    localStorage.setItem("cart", JSON.stringify(newItems));
  }, { deep: true });

  function itemTotalAmount(item: CartItem) {
    return (item.price * item.quantity).toFixed(2);
  }
  async function init() {
    const userStore = useUserStore();
    localStorage.removeItem('cartId');
    // get cart from db, if no cart check local storage
    await getCartByUserId(userStore.user.id).then((res) => {
      if(res.status === 200) {
        res.json().then(async (data) => {
          localStorage.setItem('cartId', data.cart.id);
          const cartItemsFromDb: CartItem[] = data.cart.Cart_items.map((item: CartItemResponse) => {
            return {
              postgresId: item.ProductId,
              name: item.Product.name,
              description: item.Product.description,
              size: item.Product["size"] ? item.Product["size"] : 'N/A',
              price: item.Product.price.toFixed(2),
              quantity: item.quantity,
            } as unknown as CartItem;
          });
          if (localStorage.getItem('cart')) {
            const localItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
            localItems.forEach((item) => {
              const existingItem = cartItemsFromDb.find((it) => it.postgresId === item.postgresId);
              if (existingItem) {
                existingItem.quantity = cleanQuantity(item.quantity + existingItem.quantity);
              } else {
                cartItemsFromDb.push(item);
              }
            });
          }
          rawItems.value = cartItemsFromDb;
          await updateCartInDb();
        });
      } else {
        if(localStorage.getItem('cart')) {
          rawItems.value = JSON.parse(localStorage.getItem('cart') || '[]');
          createCart(id.value!, userStore.user.id, rawItems.value).then((res) => {
            if(res.status === 201) {
              localStorage.setItem('cartId', id.value!);
            }
          });
        }
        else {
          createCart(id.value!, userStore.user.id, []).then((res) => {
            if(res.status === 201) {
              localStorage.setItem('cartId', id.value!);
            }
          });
        }
      }
    });
  }
  async function addToCart(item: CartItem) {
    item.quantity = cleanQuantity(item.quantity);
    let existingItem = rawItems.value.find((it) => it.postgresId === item.postgresId)
    if(existingItem) {
      await updateQuantity(item.postgresId, existingItem.quantity + item.quantity);
    }
    else {
      rawItems.value.push(item);
      await updateCartInDb();
    }
  }
  async function updateQuantity(postgresId: string, quantity: number) {
    const item = rawItems.value.find((item) => item.postgresId === postgresId)
    if (item) {
      if(quantity <= 0) {
        await removeFromCart(postgresId)
      } else {
        item.quantity = cleanQuantity(quantity);
        await updateCartInDb();
      }
    } else {
      console.error('Item not found in cart');
    }
  }
  async function removeFromCart(postgresId: string) {
    rawItems.value = rawItems.value.filter((item) => item.postgresId !== postgresId)
    await updateCartInDb();
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

  async function updateCartInDb() {
    const userStore = useUserStore();
    if(!!userStore.user.id) {
      await updateCart(id.value!, userStore.user.id, rawItems.value);
    }
  }
  function cleanQuantity(quantity: number) {
    return quantity < 0 ? 0 : quantity > 10 ? 10 : quantity;
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
