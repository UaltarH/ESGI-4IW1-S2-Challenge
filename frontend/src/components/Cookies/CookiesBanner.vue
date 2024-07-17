<template>
  <div v-if="!isCookiesReviewed" class="cookie-banner">
    <div class="flex flex-col items-center justify-between">
      <LogoWithText class="dark:fill-white" />
      <CookiesContent />
      <div class="flex items-center gap-4">
        <button type="button" class="btn" @click="handleAcceptCookies">Accepter</button>
        <button type="button" class="btn btn--primary" @click="handleRefuseCookies">Refuser</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Cookies from "js-cookie";
import CookiesContent from "@/components/Cookies/CookiesContent.vue";
import LogoWithText from "@/components/icons/logoWithText.vue";
import {onMounted, ref} from "vue";

const isCookiesReviewed = ref(false);

onMounted(() => {
  const acceptCookies = Cookies.get("accept-cookies");
  if (acceptCookies !== undefined) isCookiesReviewed.value = true;
});

function handleAcceptCookies() {
  Cookies.set("accept-cookies", "true", { expires: 30 });
  isCookiesReviewed.value = true;
}
function handleRefuseCookies() {
  Cookies.set("accept-cookies", "false", { expires: 30 });
  isCookiesReviewed.value = true;
}
</script>