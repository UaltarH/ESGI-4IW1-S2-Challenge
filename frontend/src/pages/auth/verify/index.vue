<template>
    <div>
        <h1 v-if="verificationStatus === 'success'">
            Votre email a bien été vérifié. Cordialement
        </h1>
        <h1 v-else-if="verificationStatus === 'error'">
            La vérification a échoué. Veuillez réessayer ou contacter le support.
        </h1>
        <h1 v-else>
            Vérification en cours...
        </h1>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const verificationStatus = ref('pending');

onMounted(async () => {
    const route = useRoute();
    const token = route.params.token;

    try {
        const response = await fetch(`http://localhost:8000/verify/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            verificationStatus.value = 'success';
        } else {
            verificationStatus.value = 'error';
        }
    } catch (error) {
        console.error('Verification error:', error);
        verificationStatus.value = 'error';
    }
});
</script>