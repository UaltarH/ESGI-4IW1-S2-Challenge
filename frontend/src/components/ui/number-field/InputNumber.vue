<template>
  <div class="number-field group">
    <button type="button" aria-label="decrement" @click="handleDecrement">-</button>
    <input
        type="number"
        :value="props.value"
        :min="props.min === undefined ? undefined : props.min"
        :max="props.max === undefined ? undefined : props.max"
        :step="props.step"
        :id="props.id"
        :name="props.name"
        @change="emits('update:modelValue', $event.target.value)"
        class="group-focus:ring-2 group-focus:ring-gray-600 group-focus:ring-opacity-50"
    />
    <button type="button" aria-label="increment" @click="handleIncrement">+</button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
  step: {
    type: Number,
    default: 1,
  },
});
const emits = defineEmits(["update:modelValue"]);

function handleIncrement() {
  emits("update:modelValue", props.value + props.step);
}
function handleDecrement() {
  emits("update:modelValue", props.value - props.step);
}
</script>
<style scoped>
nput::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>