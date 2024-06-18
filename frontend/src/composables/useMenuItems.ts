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
      title: "Articles",
      icon: "",
      route: "/articles",
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
        }
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

  return { menuItems };
};
