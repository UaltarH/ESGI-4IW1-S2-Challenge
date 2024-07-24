import { acceptHMRUpdate, defineStore } from 'pinia'
import { useUserStore } from './user'
import { CartItem } from "@/dto/cart.dto.ts";
import { computed, ref } from "vue";
import { useCart } from "@/composables/api/useCart.ts";
import {CartItemResponse} from "@/dto/api/cartItem.dto.ts";

const {
  getCart,
  getCartByUserId,
  createCart,
  createCartNoUser,
  updateCartUser,
  updateCartWithProduct,
  deleteCart
} = useCart();

export const useCartStore = defineStore('cart', () => {
  const rawItems = ref<CartItem[] | undefined>();
  const id = ref<string | null>(null);

  const cartItems = computed(() => {
    return rawItems.value ? rawItems.value : [];
  });
  const cartTotal = computed(() => {
    if(!cartItems.value) return '0.00';
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
  async function init(item: CartItem) {
    rawItems.value = [item];
    const userStore = useUserStore();
    if(!userStore.user.id) {
      await initNotLoggedIn();
    }
    else {
      await initLoggedIn();
    }
  }
  async function initNotLoggedIn() {
    await createCartNoUser(rawItems.value!).then((res) => {
      if(res.status === 201) {
        res.json().then((data) => {
          id.value = data.cart.id;
          localStorage.setItem('cartId', data.cart.id);
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }
  async function initLoggedIn() {
    const userStore = useUserStore();
    await createCart(rawItems.value!, userStore.user.id).then((res) => {
      if (res.status === 201) {
        res.json().then((data) => {
          id.value = data.cart.id;
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }
  async function mergeOrLinkCart() {
    const userStore = useUserStore();
    // get cart from db, if no cart check local storage
    await getCartByUserId(userStore.user.id).then(async (res) => {
      if (res.status === 200) {
        res.json().then(async (data) => {
          await mergeCarts(data);
        });
      } else {
        const localCartId = localStorage.getItem('cartId');
        if (localCartId) {
          await linkCartToUser(userStore.user.id, localCartId).then(() => {

            id.value = localCartId;
          });
        }
      }
    });
  }
  async function mergeCarts(data :{cart: {id: string, Cart_items: CartItemResponse[]}}) {
    const oldCartId = localStorage.getItem('cartId');
    localStorage.removeItem('cartId');
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
    id.value = data.cart.id;
    if (oldCartId) {
      rawItems.value!.forEach((item) => {
        const existingItem = cartItemsFromDb.find((it) => it.postgresId === item.postgresId);
        if (existingItem) {
          existingItem.quantity = cleanQuantity(item.quantity + existingItem.quantity);
        } else {
          cartItemsFromDb.push(item);
        }
      });
      rawItems.value = cartItemsFromDb;
      await updateCartInDb().then(async () => {
        await linkCartToUser(useUserStore().user.id, oldCartId);
        await deleteCart(oldCartId!);
      });
    } else rawItems.value = cartItemsFromDb;
  }
  async function linkCartToUser(userId: string, cartId:string) {
    await updateCartUser(cartId, userId).then(async (res) => {
      if (res.status === 204) {
        localStorage.removeItem('cartId');
      }
    });
  }
  async function getGuestCartItems(cartId: string) {
    await getCart(cartId).then((res: Response) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          rawItems.value = data.cart.Cart_items.map((item: CartItemResponse) => {
            return {
              postgresId: item.ProductId,
              name: item.Product.name,
              description: item.Product.description,
              size: item.Product["size"] ? item.Product["size"] : 'N/A',
              price: item.Product.price.toFixed(2),
              quantity: item.quantity,
            } as unknown as CartItem;
          });
        });
      } else {
        console.error('guest cart not found in db');
      }
    });
  }
  async function addToCart(item: CartItem) {
    if(!id.value) {
      await init(item);
    } else {
      item.quantity = cleanQuantity(item.quantity);
      let existingItem = rawItems.value!.find((it) => it.postgresId === item.postgresId)
      if (existingItem) {
        await updateQuantity(item.postgresId, existingItem.quantity + item.quantity);
      } else {
        rawItems.value!.push(item);
        await updateCartInDb();
      }
    }
  }
  async function updateQuantity(postgresId: string, quantity: number) {
    const existingItem = rawItems.value!.find((item) => item.postgresId === postgresId)
    if (existingItem) {
      if(quantity <= 0) {
        await removeFromCart(postgresId)
      } else {
        existingItem.quantity = cleanQuantity(quantity);
        await updateCartInDb();
      }
    } else {
      console.error('Item not found in cart');
    }
  }
  async function removeFromCart(postgresId: string) {
    rawItems.value = rawItems.value!.filter((item) => item.postgresId !== postgresId)
    if(rawItems.value.length === 0) await deleteCartFromDb();
    else await updateCartInDb();
  }

  async function deleteCartFromDb() {
    await deleteCart(id.value!);
    $reset();
  }

  async function updateCartInDb() {
    await updateCartWithProduct(id.value!, rawItems.value!);
  }
  function cleanQuantity(quantity: number) {
    return quantity < 0 ? 0 : quantity > 10 ? 10 : quantity;
  }
  function $reset() {
    rawItems.value = undefined;
    id.value = null;
    localStorage.removeItem('cartId');
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
    itemTotalAmount,
    mergeOrLinkCart,
    getGuestCartItems,
    $reset,
  }
});
// Rechargement à chaud HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
