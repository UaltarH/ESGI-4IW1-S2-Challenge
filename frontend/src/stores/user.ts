// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAuth } from '@/composables/api/useAuth'
import {ref} from "vue";
import {ApiResponse} from "@/dto/apiResponse.dto.ts";
const { loginUser } = useAuth();

export const useUserStore = defineStore(('user'), () => {
    const id = ref('');
    const isAdmin = ref(false);
    function logout() {
        id.value = '';
        isAdmin.value = false;

        // we could do other stuff like redirecting the user
    }

    /**
     * Attempt to login a user
     */
    async function login(param: {[key:string]: string}, handler: Function){
        const { email, password } = param;
        const res:Response = await loginUser({ email, password });
        if(res.status === 200) {
            res.json().then((data:ApiResponse) => {
                const userData = data.data;
                id.value = userData.id;
                isAdmin.value = userData.isAdmin;
                handler(userData);
            });
        } else {
            handler({error: 'Invalid credentials'});
        }
    }
    return { id, isAdmin, login, logout }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
