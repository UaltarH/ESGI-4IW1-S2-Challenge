<template>
  <Card class="bg-white shadow-lg rounded-lg">
    <CardHeader class="border-b border-gray-200 p-4">
      <CardTitle class="text-2xl font-bold text-gray-900">{{ title }}</CardTitle>
      <CardDescription class="text-gray-500">{{ title }}</CardDescription>
    </CardHeader>
    <CardContent class="p-6">
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(value, key) in filteredData"
          :key="key"
          class="w-full flex flex-col border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
        >
          <div class="mb-2">
            <label class="font-semibold text-gray-800">{{ getLabel(key) }}</label>
          </div>
          <div>
            <span v-if="!(isObject(value) || isArray(value))" class="text-gray-900">
              {{ transformValue(key, value) }}
            </span>
            <div v-if="isObject(value) || isArray(value)" class="mt-2">
              <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey" class="pl-4 border-b border-gray-200 py-2">
                <label class="font-semibold text-gray-800">{{ getLabel(`${key}.${nestedKey}`) }}</label>
                <div class="mt-1">
                  <span v-if="!(isObject(nestedValue) || isArray(nestedValue))" class="text-gray-900">
                    {{ transformValue(nestedKey, nestedValue) }}
                  </span>
                  <div v-if="isObject(nestedValue) || isArray(nestedValue)" class="mt-2">
                    <div v-for="(deepValue, deepKey) in nestedValue" :key="deepKey" class="pl-4 border-b border-gray-200 py-2">
                      <label class="font-semibold text-gray-800">{{ getLabel(`${key}.${nestedKey}.${deepKey}`) }}</label>
                      <div class="mt-1">
                        <span class="text-gray-900">
                          {{ transformValue(deepKey, deepValue) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex justify-between p-4 border-t border-gray-200">
      <Button v-if="buttons.includes('close')" @click="onCloseVisualizer" class="bg-red-500 text-white hover:bg-red-600">
        Fermer
      </Button>
      <Button v-if="buttons.includes('invoice')" @click="onCreateFacture(data)" class="bg-blue-500 text-white hover:bg-blue-600">
        Générer une facture
      </Button>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  data: Record<string, any>;
  title: string;
  buttons: string[];
  fields?: string[];
  labels?: { [key: string]: string };
  valueTransforms?: { [key: string]: (value: any) => any };
}

const props = defineProps<Props>();
const emit = defineEmits(['createFacture', 'closeVisualizer']);

function isObject(value: any): value is Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

function onCreateFacture(item: any): void {
  emit('createFacture', item);
}

function onCloseVisualizer(): void {
  emit('closeVisualizer');
}

function getLabel(key: string): string {
  if (props.labels && props.labels[key]) {
    return props.labels[key];
  }

  const parts = key.split('.').map(part => part.trim()).filter(part => isNaN(Number(part)));
  let currentKey = '';

  for (const part of parts) {
    if (currentKey) {
      currentKey += `.${part}`;
    } else {
      currentKey = part;
    }
  }
  
  if (props.labels && props.labels[currentKey]) {
    return props.labels[currentKey];
  }

  return key;
}

function transformValue(key: string, value: any): any {
  if (props.valueTransforms && props.valueTransforms[key]) {
    return props.valueTransforms[key];
  }
  return value;
}

const filteredData = computed<Record<string, any>>(() => {
  if (props.fields && props.fields.length > 0) {
    return props.fields.reduce((acc, field) => {
      if (props.data.hasOwnProperty(field)) {
        acc[field] = props.data[field];
      }
      return acc;
    }, {} as Record<string, any>);
  }
  return props.data;
});
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
