<template>
  <nav class="tab-container">
    <ul class="flex justify-between gap-4">
      <li class="tab" :class="activeTab === 'tab1' ? 'tab--active' : ''">
        <button type="button" :aria-label="'onglet' + props.tab1Title " @click="changeTab('tab1')">{{ props.tab1Title }}</button>
      </li>
      <li class="tab" :class="activeTab === 'tab2' ? 'tab--active' : ''">
        <button type="button" :aria-label="'onglet' + props.tab2Title " @click="changeTab('tab2')">{{ props.tab2Title }}</button>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import {ref} from "vue";

const emits = defineEmits(['changeTab']);
const props = defineProps({
  tab1Title: String,
  tab2Title: String
});
const activeTab = ref('tab1');

function changeTab(tab: string) {
  activeTab.value = tab;
  emits('changeTab', tab);
}
</script>