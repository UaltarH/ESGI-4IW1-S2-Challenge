// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAuth } from '@/composables/api/useAuth'
import { computed, ref } from "vue";
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "vue-router";
import { useNotificationStore} from "@/stores/notification.ts";

const { loginUser } = useAuth();

export const useUserStore = defineStore(('user'), () => {
    const token = ref(Cookies.get('auth_token'));
    const user = computed(() => {
        if(token.value === undefined) {
            return {id: '', role: ''};
        }
        const data:JwtPayload & {id:string, role:string} = jwtDecode(token.value);
        return {id: data.id, role: data.role};
    });
    function logout() {
        Cookies.remove('auth_token');
        token.value = undefined;
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
            const cookieToken = Cookies.get('auth_token');
            if(cookieToken === undefined) {
                handler(500);
                return;
            }
            token.value = cookieToken;
            handler(res.status);
        } else {
            handler(res.status);
        }
    }
    return { token, user, login, logout }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
