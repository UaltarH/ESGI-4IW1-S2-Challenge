<template>
    <div>
        <h1 v-if="verificationStatus === 'success'">
            Votre email a bien été vérifié. Cordialement
        </h1>
        <h1 v-else-if="verificationStatus === 'error'">
            La vérification a échoué.
            <br>
            Veuillez réessayer ou contacter le support.
        </h1>
        <h1 v-else>
            Vérification en cours...
        </h1>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/api/useAuth.ts';
import { useNotificationStore } from "@/stores/notification.ts";

const router = useRouter();
const { verifyUser } = useAuth();
const notificationStore = useNotificationStore();
const verificationStatus = ref('pending');
const route = useRoute();
const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token;

async function verifyUserToken(token: string) {
    try {
        const response = await verifyUser(token);
        if (response.status === 200) {
            verificationStatus.value = 'success';
            notificationStore.add({ message: 'Vérification réussie', timeout: 3000, type: 'success' });
            setTimeout(() => {
                router.push({ name: 'home' });
            }, 3000);
        }
        else {
            verificationStatus.value = 'error';
            notificationStore.add({ message: 'Une erreur est survenue lors de la vérification de votre compte', timeout: 3000, type: 'error' });
            setTimeout(() => {
                router.push({ name: 'home' });
            }, 3000);
        }
    } catch (error) {
        console.error(error);
        verificationStatus.value = 'error';
        notificationStore.add({ message: 'Une erreur est survenue, veuillez réssayer plus tard', timeout: 3000, type: 'error' });
    }
};

verifyUserToken(token);

</script>