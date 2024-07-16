<template>
  <nav class="account-side-menu">
    <ul>
      <li class="">
        <router-link to="/user/data" aria-label="Mes données">
          Mes données
          <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>

      </li>
      <li class="border-b w-full h-full">
        <router-link to="/user/orders" aria-label="Mes commandes">
          Mes commandes
          <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5777 3.38197L17.5777 4.43152C19.7294 5.56066 20.8052 6.12523 21.4026 7.13974C22 8.15425 22 9.41667 22 11.9415V12.0585C22 14.5833 22 15.8458 21.4026 16.8603C20.8052 17.8748 19.7294 18.4393 17.5777 19.5685L15.5777 20.618C13.8221 21.5393 12.9443 22 12 22C11.0557 22 10.1779 21.5393 8.42229 20.618L6.42229 19.5685C4.27063 18.4393 3.19479 17.8748 2.5974 16.8603C2 15.8458 2 14.5833 2 12.0585V11.9415C2 9.41667 2 8.15425 2.5974 7.13974C3.19479 6.12523 4.27063 5.56066 6.42229 4.43152L8.42229 3.38197C10.1779 2.46066 11.0557 2 12 2C12.9443 2 13.8221 2.46066 15.5777 3.38197Z" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </router-link>
      </li>
      <li class="border-b w-full h-full">
        <router-link to="/user/settings" aria-label="Paramètres">
          Paramètres
          <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5M14 5H20M10 5L4 5M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM16 12H4M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19ZM8 19H20" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </router-link>
      </li>
      <li class="border-b w-full h-full">
        <router-link to="/logout" aria-label="Se déconnecter">
          Se déconnecter
          <svg width="24" height="24" viewBox="0 0 24 24" class="stroke-dark-blue dark:stroke-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 4L18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </li>
    </ul>
  </nav>
</template>