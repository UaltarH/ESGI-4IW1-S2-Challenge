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
    console.log('init cart');
    rawItems.value = [item];
    const userStore = useUserStore();
    if(!userStore.user.id) {
      await initNotLoggedIn();
    }
    else {
      await initLoggedIn();
    }
    console.log('cart initialized');
  }
  async function initNotLoggedIn() {
    console.log('init not logged in');
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
    console.log('init logged in');
    const userStore = useUserStore();
    await createCart(rawItems.value!, userStore.user.id).then((res) => {
      if (res.status === 201) {
        res.json().then((data) => {
          console.log('cart created : ', data);
          id.value = data.cart.id;
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }
  async function mergeOrLinkCart() {
    console.log('>>> merging or linking cart');
    const userStore = useUserStore();
    // get cart from db, if no cart check local storage
    await getCartByUserId(userStore.user.id).then(async (res) => {
      if (res.status === 200) {
        console.log('cart found in db');
        res.json().then(async (data) => {
          await mergeCarts(data);
        });
      } else {
        console.log('cart not found in db');
        const localCartId = localStorage.getItem('cartId');
        if (localCartId) {
          console.log('cart id found, updating UserId of cart ...');
          await linkCartToUser(userStore.user.id, localCartId).then(() => {

            id.value = localCartId;
          });
        }
      }
    });
  }
  async function mergeCarts(data :{cart: {id: string, Cart_items: CartItemResponse[]}}) {
    console.log('>>> merging carts');
    const oldCartId = localStorage.getItem('cartId');
    localStorage.removeItem('cartId');
    console.log('guest cart ? ', oldCartId);
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
      console.log('cart found in local, merging ...');
      rawItems.value!.forEach((item) => {
        const existingItem = cartItemsFromDb.find((it) => it.postgresId === item.postgresId);
        if (existingItem) {
          existingItem.quantity = cleanQuantity(item.quantity + existingItem.quantity);
        } else {
          cartItemsFromDb.push(item);
        }
      });
      console.log('updating cart in db after merge : ', cartItemsFromDb);
      rawItems.value = cartItemsFromDb;
      await updateCartInDb().then(async () => {
        await linkCartToUser(useUserStore().user.id, oldCartId);
        console.log('deleting old cart : ', oldCartId);
        await deleteCart(oldCartId!);
      });
    } else rawItems.value = cartItemsFromDb;
  }
  async function linkCartToUser(userId: string, cartId:string) {
    await updateCartUser(cartId, userId).then(async (res) => {
      if (res.status === 204) {
        console.log('cart successfully updated with UserId');
        localStorage.removeItem('cartId');
      }
    });
  }
  async function getGuestCartItems(cartId: string) {
    await getCart(cartId).then((res: Response) => {
      if (res.status === 200) {
        console.log('guest cart found in db');
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
    console.log('>>> adding item to cart');
    if(!id.value) {
      console.log('no cart id found, initializing cart ...');
      await init(item);
    } else {
      item.quantity = cleanQuantity(item.quantity);
      let existingItem = rawItems.value!.find((it) => it.postgresId === item.postgresId)
      if (existingItem) {
        console.log('item already in cart, updating quantity');
        await updateQuantity(item.postgresId, existingItem.quantity + item.quantity);
      } else {
        console.log('item not in cart, adding to cart');
        rawItems.value!.push(item);
        await updateCartInDb();
      }
    }
  }
  async function updateQuantity(postgresId: string, quantity: number) {
    console.log('>>> updating quantity of item in cart');
    const existingItem = rawItems.value!.find((item) => item.postgresId === postgresId)
    if (existingItem) {
      console.log('item found in cart');
      if(quantity <= 0) {
        console.log('quantity is 0, removing item from cart');
        await removeFromCart(postgresId)
      } else {
        console.log('updating quantity of item in cart');
        existingItem.quantity = cleanQuantity(quantity);
        await updateCartInDb();
      }
    } else {
      console.error('Item not found in cart');
    }
  }
  async function removeFromCart(postgresId: string) {
    console.log('>>> removing item from cart');
    rawItems.value = rawItems.value!.filter((item) => item.postgresId !== postgresId)
    if(rawItems.value.length === 0) await deleteCartFromDb();
    else await updateCartInDb();
  }

  async function deleteCartFromDb() {
    console.log('>>> deleting cart');
    await deleteCart(id.value!);
    $reset();
  }

  async function updateCartInDb() {
    console.log('>>> updating cart in db : ', id.value);
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
