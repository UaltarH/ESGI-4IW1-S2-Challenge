<template>
    <DialogContent class="overflow-auto h-[90vh]">
        <DialogHeader>
            <DialogTitle class="text-xl font-semibold">Édition d'un élément</DialogTitle>
            <DialogDescription class="text-gray-600 mt-2">
                Modifiez les champs de l'élément sélectionné ci-dessous.
            </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="onSubmit" class="flex flex-col h-full">
            <div v-for="(value, key) in item" :key="key">
                <div v-if="!['id'].includes(key)"  class="m-5">
                    <FormField :name="key" v-slot="{ componentField }">
                        <FormItem>
                            <FormLabel :for="key" class="block text-sm font-medium text-gray-700">{{ key }}</FormLabel>
                            <FormControl>
                                <Input
                                    v-bind="componentField"
                                    :id="key"
                                    v-model="item[key]"
                                    type="text"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </FormControl>
                            <div v-if="errors && errors[key]" class="text-red-500 text-sm mt-1">
                                {{ errors[key] }}
                            </div>
                        </FormItem>
                    </FormField>
                </div>
            </div>
            <div class="w-full flex justify-center items-center mt-6">
                <DialogFooter as-child>
                    <Button type="submit" class="bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500">Sauvegarder</Button>
                </DialogFooter>
            </div>
        </form>
    </DialogContent>
</template>

<script lang="ts" setup>
import { reactive, defineProps, defineEmits, watch } from 'vue';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const props = defineProps({
    model: Object,
    errors: Object
});


const emits = defineEmits(['close', 'save']);

const item = reactive({ ...props.model });

watch(() => props.model, (newVal) => {
    Object.assign(item, newVal);
}, { deep: true });

const onSubmit = () => {
    emits('save', item);
};
</script>
