<template>

</template>
<script lang="ts" setup>
import {useUserStore} from "@/stores/user.ts";
import {onBeforeMount} from "vue";

const userStore = useUserStore();

onBeforeMount(() => {
  userStore.logout();
});
</script>