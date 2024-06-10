import {reactive} from "vue";

export const useMenuItems = () => {
    const menuItems = reactive([
        {
            title: 'Accueil',
            icon: '',
            route: '/',
            access: 'all',
        },
        {
            title: 'Articles',
            icon: '',
            route: '/articles',
            access: 'all',
        },
        {
            title: 'À propos',
            icon: '',
            route: '/about',
            access: 'all',
        }
    ]);

    return {menuItems}
}