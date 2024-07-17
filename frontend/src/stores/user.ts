// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAuth } from '@/composables/api/useAuth'
import { computed, ref } from "vue";
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "vue-router";
import { useNotificationStore} from "@/stores/notification.ts";
import { UserService } from "@/composables/api/user.service.ts";
import { User } from '@/dto/user.dto';

const { loginUser } = useAuth();
const { getUserById } = UserService();

export const useUserStore = defineStore(('user'), () => {
    const token = ref(Cookies.get('auth_token'));
    const user = computed(async () => {
        if(token.value === undefined) {
            return {id: '', role: ''};
        }
        const data:JwtPayload & {id:string, role:string} = jwtDecode(token.value);
        let userInfo: User = {} as User;

        await getUserById(
            data.id,
            (res:Response) => res.json().then((data:any) => userInfo = data.user),            
            {fields: ["firstname", "lastname", "email", "phone", "birthdate", "address", "zipcode", "city", "country"]}
        );

        return {id: data.id, role: data.role, firstname: userInfo.firstname, lastname: userInfo.lastname, email: userInfo.email, phone: userInfo.phone, birthdate: userInfo.birthdate, address: userInfo.address, zipcode: userInfo.zipcode, city: userInfo.city, country: userInfo.country};
    });
    function logout() {
        Cookies.remove('auth_token', { path: '/', domain: import.meta.env.VITE_APP_DOMAIN});
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
