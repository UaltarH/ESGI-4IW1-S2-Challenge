<template>
  <Card>
    <CardHeader>
      <CardTitle>Visualiser</CardTitle>
      <CardDescription>{{ title }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="(value, key) in filteredData" :key="key" class="flex flex-col border-solid border-2 rounded-lg p-3">
          <label class="font-semibold capitalize">{{ getLabel(key) }}</label>
          <span v-if="!(isObject(value) || isArray(value))" class="text-gray-700">
            {{ transformValue(key, value) }}
          </span>
          <div v-if="isObject(value) || isArray(value)">
            <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey" class="pl-4">
              <label class="font-semibold capitalize mr-2">{{ getLabel(nestedKey) }}</label>
              <span v-if="!(isObject(nestedValue) || isArray(nestedValue))" class="text-gray-700">
                {{ transformValue(nestedKey, nestedValue) }}
              </span>
              <div v-if="isObject(nestedValue) || isArray(nestedValue)">
                <div v-for="(deepValue, deepKey) in nestedValue" :key="deepKey" class="pl-4">
                  <label class="font-semibold capitalize mr-2">{{ getLabel(deepKey) }}</label>
                  <span class="text-gray-700">
                    {{ transformValue(deepKey, deepValue) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex w-full justify-around px-6 pb-6">
      <Button v-if="buttons.includes('close')" @click="onCloseVisualizer">
        Fermer
      </Button>
      <Button v-if="buttons.includes('invoice')" @click="onCreateFacture(data)">
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

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase();
}

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
  return props.labels && props.labels[key] ? props.labels[key] : formatKey(key);
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
