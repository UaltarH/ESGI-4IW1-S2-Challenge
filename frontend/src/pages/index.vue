<template>
<div class="relative overflow-hidden banner">
    <div class="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col justify-center items-start p-5">
      <h1 class="text-4xl font-bold">Découvrez notre entreprise</h1>
      <p class="text-lg mt-2">Nous offrons une plateforme simple et efficace pour tous vos besoins en cartons de toutes sortes.</p>
    </div>
</div>

<div class="mx-auto p-6 z-10 bg-white dark:bg-dark-blue">
    <h2 class="text-3xl font-bold mt-8 text-center">À propos de notre entreprise</h2>
    <p class="text-lg mt-4 text-center">
        Chez BoxToBe, nous sommes spécialisés dans la vente de cartons de haute qualité pour tous vos besoins. Que vous ayez besoin de cartons pour l'expédition, le stockage, ou des projets spéciaux, nous avons ce qu'il vous faut. 
    </p>
</div>

<div class="p-6 bg-white dark:bg-dark-blue grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto">
  <div class="flex flex-col items-center">
    <img src="../../public/reassurance-qualite.svg" class="w-16 h-16" />
    <p class="text-center mt-4">Emballage de qualité<br />Réception produit sécurisée</p>
  </div>
  <div class="flex flex-col items-center">
    <img src="../../public/reassurance-expedition.svg" class="w-16 h-16" />
    <p class="text-center mt-4">Commande avant 13H<br />Expédition le jour même</p>
  </div>
  <div class="flex flex-col items-center">
    <img src="../../public/reassurance-livraison.svg" class="w-16 h-16" />
    <p class="text-center mt-4">Livraison 24/48H à domicile<br />France et Bénélux</p>
  </div>
  <div class="flex flex-col items-center">
    <img src="../../public/reassurance-notification.svg" class="w-16 h-16" />
    <p class="text-center mt-4">Notification par mail et SMS<br />le jour de l'expédition</p>
  </div>
</div>

<Separator/>

<div class="flex flex-col items-center py-8">
  <h3 class="text-2xl font-bold mb-4">Derniers produits ajoutés</h3>
  <LastProductsCarousel :contents="lastProducts" />
</div>

</template>
<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue';
import { Separator } from '@/components/ui/separator';
import LastProductsCarousel  from '@/components/common/products/LastProductsCarousel.vue';
import { mongoProduct } from '@/dto/MongoProduct.dto';
import { ProductService } from '@/composables/api/products.service';

const lastProducts: Ref<mongoProduct[]> = ref([]);

onMounted(async () => {
  await fetchLastProducts();
});

const fetchLastProducts = async () => {
  try {
    const response = await ProductService().getLastMongoProduct();
    lastProducts.value = response.products;
  } catch (error) {
    console.error('Error fetching last products:', error);
  }
};
</script>
<style scoped>
.banner {
  background-image: url("../../public/home-page-image-test.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 40rem;
  width: 100%;
}
</style>
