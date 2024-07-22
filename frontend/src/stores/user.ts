// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAuth } from '@/composables/api/useAuth'
import { computed, ref } from "vue";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "vue-router";
import { useNotificationStore} from "@/stores/notification.ts";
import {useCartStore} from "@/stores/cart.ts";

const { loginUser } = useAuth();

export const useUserStore = defineStore(('user'), () => {
    const token = ref(localStorage.getItem('auth_token'));
    const user = computed(() => {
        if(token.value === null) {
            return {id: '', role: ''};
        }
        const data:JwtPayload & {id:string, role:string} = jwtDecode(token.value);
        return {id: data.id, role: data.role};
    });
    function logout() {
        const cartStore = useCartStore();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('cartId');
        token.value = null;
        cartStore.$reset();
        // we could do other stuff like redirecting the user
        const router = useRouter();
        router.push({name: 'home'}).then(() => {
            const notificationStore = useNotificationStore();
            notificationStore.add({ message: 'Vous êtes déconnecté(e)', type: 'success', timeout: 3000 });
        });
    }
    /**
     * Attempt to login a user
     */
    async function login(param: {[key:string]: string}, handler: Function){
        const { email, password } = param;
        const res:Response = await loginUser({ email, password });
        if(res.status === 200) {
            res.json().then((data) => {
                if(data.token) {
                    token.value = data.token;
                    localStorage.setItem('auth_token', data.token);
                    handler(res.status);
                }
                else {
                    handler(500);
                }
            });
        } else {
            handler(res.status);
        }
    }
    return { token, user, login, logout }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}