import { reactive } from "vue";

export const useMenuItems = () => {
  const menuItems = reactive([
    {
      title: "Accueil",
      icon: "",
      route: "/",
      access: "all",
    },
    {
      title: "Produits",
      icon: "",
      route: "/products",
      access: "all",
    },
    {
      title: "Admin",
      icon: "",
      route: "",
      access: "admin",
      children: [
        {
          title: "Utilisateurs",
          icon: "",
          route: "/admin/users",
          access: "admin",
        },
        {
          title: "Produits",
          icon: "",
          route: "/admin/products",
          access: "admin",
        },
        {
          title: "Commandes",
          icon: "",
          route: "/admin/orders",
          access: "admin",
        },
        {
          title: "Dashboard",
          icon: "",
          route: "/admin/dashboard",
          access: "admin",
        },
        {
          title: "Stocks",
          icon: "",
          route: "/admin/stocks",
          access: "admin",
        },
      ],
    }
  ]);

  const adminItems = menuItems.filter(item =>
    item.access === "admin"
  );

  adminItems.forEach(item => {
    if (item.children) {
      item.children = item.children.filter(child =>
        child.access === "admin"
      );
    }
  });

  const profileMenuItems = reactive([
    {
      title: "Profil",
      icon: "",
      route: "/user/account",
      access: "user",
    },
    {
      title: "Déconnexion",
      icon: "",
      route: "/logout",
      access: "user",
    },
  ]);
  return { menuItems, profileMenuItems, adminItems };
};
