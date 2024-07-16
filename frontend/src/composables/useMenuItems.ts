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
      title: "À propos",
      icon: "",
      route: "/about",
      access: "all",
    },
    {
      title: "Admin",
      icon: "",
      route: "",
      access: "admin",
      children: [
        {
          title: "Roles",
          icon: "",
          route: "/admin/roles",
          access: "admin",
        },
        {
          title: "Utilisateurs",
          icon: "",
          route: "/admin/users",
          access: "admin",
        },
        {
          title: "Dashboard",
          icon: "",
          route: "/admin/dashboard",
          access: "admin",
        },
      ],
    },
    {
      title: "Composants",
      icon: "",
      route: "",
      access: "all",
      children: [
        {
          title: "Tableau",
          icon: "",
          route: "/components/table",
          access: "all",
        },
      ],
    },
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
