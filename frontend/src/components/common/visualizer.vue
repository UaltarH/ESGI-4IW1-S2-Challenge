<template>
    <Card>
        <CardHeader>
          <CardTitle>Visualiser</CardTitle>
          <CardDescription>{{title}}</CardDescription>
        </CardHeader>
        <CardContent>            
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div v-for="(value, key) in data" :key="key" class="flex flex-col border-solid border-2 rounded-lg p-3">
                      <label class="font-semibold capitalize">{{ key }}</label>
                      <span v-if="!(isObject(value) || isArray(value))" class="text-gray-700">
                        {{ value }}
                      </span>
                      <!-- Check if value is an object or array and render nested data -->
                      <div v-if="isObject(value) || isArray(value)">
                        <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey" class="pl-4">
                          <label class="font-semibold capitalize mr-2">{{ nestedKey }}</label>
                          <span v-if="!(isObject(nestedValue) || isArray(nestedValue))" class="text-gray-700">
                            {{ nestedValue }}
                          </span>
                          <div v-if="isObject(nestedValue) || isArray(nestedValue)">
                                <div v-for="(deepValue, deepKey) in nestedValue" :key="deepKey" class="pl-4">
                                <label class="font-semibold capitalize mr-2">{{ deepKey }}</label>
                                <span class="text-gray-700">
                                    {{ deepValue }}
                                </span>
                                </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
        </CardContent>
        <CardFooter class="flex w-full justify-around px-6 pb-6">
            <Button v-if="buttons.includes('close')" @click="onCloseVisualizer()">
                Fermer
            </Button>
            <Button v-if="buttons.includes('invoice')" @click="onCreateFacture(data)">
                Générer une facture
            </Button>
        </CardFooter>
    </Card>
</template>
<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button'

defineProps<{
  data: any;
  title: string;
  buttons: string[];
}>();

const emit = defineEmits([
  "createFacture",
  "closeVisualizer",
]);

function formatKey(key: string) {      
    return key.replace(/([A-Z])/g, ' $1').toLowerCase();
}
function formatValue(value: any, key: string) {
      if (key.toLowerCase().includes('date') && value) {
        return new Date(value).toLocaleString();
      }
      return value;
    }
function isObject(value: any) {
      return value && typeof value === 'object' && !Array.isArray(value);
    }
function isArray(value: any) {
      return Array.isArray(value);
}


function onCreateFacture(item: any) {
  emit("createFacture", item);
}

function onCloseVisualizer() {
  emit("closeVisualizer");
}
</script>