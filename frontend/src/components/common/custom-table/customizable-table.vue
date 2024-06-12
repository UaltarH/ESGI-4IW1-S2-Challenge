<script lang="ts" setup>
import { ref, computed } from "vue";
import PaginationTable from "./pagination-table.vue";

//props (input parent component)
const props = defineProps<{
  data: any[];
  columns: { name: string; key: string; sort: boolean }[];
  actions: { edit: boolean; delete: boolean };
}>();

// emit (output parent component)
const emit = defineEmits(["edit-item", "delete-item"]);

let data = computed(() => {
  return props.data;
});

// Pagination
const itemsPerPage = ref(5);
const currentPage = ref(1);
const totalItems = data.value.length;

const pageInfo = computed(() => ({
  current: currentPage.value,
  total: totalItems,
  perPage: itemsPerPage.value,
}));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + Number(itemsPerPage.value);
  return data.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value * itemsPerPage.value < totalItems) {
    currentPage.value += 1;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function changeItemsPerPage() {
  currentPage.value = 1;
}
//

// sort columns
const sortField = ref("");
const sortDirection = ref("asc");

function sortData(field: string, direction: string) {
  if (field != sortField.value && sortField.value != "") {
    sortDirection.value = "desc";
  } else {
    sortDirection.value = direction;
  }
  sortField.value = field;

  data.value.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
    let valueA = a[field];
    let valueB = b[field];

    if (typeof valueA === "string" && typeof valueB === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
      if (direction === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      if (direction === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      if (direction === "asc") {
        return valueA.getTime() - valueB.getTime();
      } else {
        return valueB.getTime() - valueA.getTime();
      }
    }
  });
}

// emit for parent component
function onEdit(item: any) {
  emit("edit-item", item);
}

function onDelete(item: any) {
  emit("delete-item", item);
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" class="min-w-fit w-[6%]">
            <div class="flex flex-col">
              <div class="flex flex-row justify-between">
                <p>{{ col.name }}</p>
                <span
                  v-if="col.sort"
                  class="cursor-pointer"
                  @click="
                    sortData(col.key, sortDirection == 'asc' ? 'desc' : 'asc')
                  "
                >
                  <ion-icon
                    name="caret-down-outline"
                    v-if="sortDirection == 'desc' && sortField == col.key"
                  ></ion-icon>
                  <ion-icon name="caret-up-outline" v-else></ion-icon>
                </span>
              </div>
              <input
                type="text"
                class="px-3 mt-4 rounded focus:shadow text-sm border border-solid border-black"
                placeholder="Search anything..."
              />
            </div>
          </th>
          <th v-if="actions.edit || actions.delete" class="min-w-fit">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.name">
          <td v-for="col in columns" :key="col.key">
            {{ (item as any)[col.key] }}
          </td>
          <td v-if="actions.edit || actions.delete" class="w-[10%]">
            <div class="flex flex-row justify-around">
              <button
                v-if="actions.edit"
                @click="onEdit(item)"
                class="bg-primary text-white rounded-sm p-1.5"
              >
                <p>Edit</p>
              </button>
              <button
                v-if="actions.delete"
                @click="onDelete(item)"
                class="bg-primary text-white rounded-sm p-1.5"
              >
                <p>Delete</p>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <PaginationTable
      :page="pageInfo"
      @emitNextPage="nextPage"
      @emitPreviousPage="previousPage"
    />

    <!-- Items Per Page Selector -->
    <select v-model="itemsPerPage" @change="changeItemsPerPage">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="25">25</option>
    </select>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
td,
th {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>
