<script lang="ts" setup>
import { ref, computed } from "vue";
import PaginationTable from "./pagination-table.vue";
import { columnsModel } from "./models/columns.interface";
import { actionsModel } from "./models/actions.interface";

defineOptions({
  name: "CustomizableTable",
  inheritAttrs: false,
});

//props (input parent component)
const props = defineProps<{
  data: any[];
  columns: columnsModel[];
  actions: actionsModel;
  numberOfItemsPerPage: number[];
  canDeleteAll: boolean; 
}>();

// emit (output parent component)
const emit = defineEmits([
  "visualize-item",
  "edit-item",
  "delete-item",
  "delete-multiple-items",
]);

let data = computed(() => {
  return props.data;
});

//used for filter data by columns
const searchTerms = ref<{ [key: string]: string }>({});
props.columns.forEach((col) => {
  searchTerms.value[col.key] = "";
});

// Pagination
const itemsPerPage = ref(5);
const currentPage = ref(1);
const totalItems = ref(data.value.length);

const pageInfo = computed(() => ({
  current: currentPage.value,
  total: totalItems.value,
  perPage: itemsPerPage.value,
}));

const paginatedData = computed(() => {
  const filteredData = filterData();
  totalItems.value = filteredData.length;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + Number(itemsPerPage.value);
  // if (filteredData.slice(start, end).length === 0) currentPage.value == 1;

  return filteredData.slice(start, end);
});

function nextPage() {
  if (currentPage.value * itemsPerPage.value < totalItems.value) {
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

// filter with search
function filterData() {
  const filtered = props.data.filter((item) => {
    let match = true;
    for (const key in searchTerms.value) {
      const searchTerm = searchTerms.value[key];
      const column = props.columns.find((col) => col.key === key);
      const value = item[key];

      if (searchTerm && column) {
        if (
          column.typeData === "string" &&
          !value.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          match = false;
        } else if (column.typeData === "number" && value !== searchTerm) {
          match = false;
        } else if (column.typeData === "date") {
          const searchDate = new Date(searchTerm);
          const itemDate = new Date(value);

          if (!isNaN(searchDate.getTime()) && !isNaN(itemDate.getTime())) {
            // Comparer uniquement par la date (sans l'heure)
            if (
              searchDate.getDate() !== itemDate.getDate() ||
              searchDate.getMonth() !== itemDate.getMonth() ||
              searchDate.getFullYear() !== itemDate.getFullYear()
            ) {
              match = false;
            }
          } else {
            match = false;
          }
        }
      }
    }
    return match;
  });
  // currentPage.value = 1;

  return filtered;
}

// display data ('pipe')
const formatValue = (value: any, type: any) => {
  if (type === "date") {
    const date = new Date(value);
    return date.toLocaleDateString();
  } else {
    return value;
  }
};

// selecing multiple items
const selectedItems = ref<any[]>([]);

// add isSelected property to each item of data
props.data.forEach((item) => {
  item.isSelected = false;
});
function toggleSelection(item: any) {
  const index = selectedItems.value.indexOf(item);
  if (item.isSelected && index === -1) {
    // add item to selectedItems
    selectedItems.value.push(item);
  } else if (!item.isSelected && index > -1) {
    // remove item from selectedItems
    selectedItems.value.splice(index, 1);
  }
}

function changePageToFirst() {
  currentPage.value = 1;
}

// export csv
function generateCSV(data: any, columns: columnsModel[]) {
  const header = columns.map((col) => col.name).join(",") + "\n";

  const rows = data
    .map((item: any) => {
      return columns
        .map((col) => {
          let value = item[col.key];

          // Formater les valeurs selon le type de données
          if (col.typeData === "number") {
            value = Number(value).toLocaleString();
          } else if (col.typeData === "date") {
            const date = new Date(value);
            value = date.toLocaleDateString();
          }

          if (typeof value === "string") {
            value = value.replace(/"/g, '""');
            if (value.includes(",")) {
              value = `"${value}"`;
            }
          }

          return value;
        })
        .join(",");
    })
    .join("\n");

  const csvContent = `${header}${rows}`;
  return csvContent;
}

async function exportToCSV(data: any, columns: columnsModel[]) {
  // Générer le contenu CSV
  const csvContent = generateCSV(data, columns);

  try {
    // Sélectionner un emplacement pour enregistrer le fichier CSV
    const handle = await window.showSaveFilePicker({
      suggestedName: "export.csv",
      types: [
        {
          description: "Fichiers CSV",
          accept: {
            "text/csv": [".csv"],
          },
        },
      ],
    });

    const writableStream = await handle.createWritable();
    await writableStream.write(csvContent);
    await writableStream.close();
  } catch (err) {
    console.error("Erreur lors de l'exportation du fichier CSV :", err);
  }
}

// emit for parent component
function onVisualize(item: any) {
  emit("visualize-item", item);
}

function onEdit(item: any) {
  emit("edit-item", item);
}

function onDelete(item: any) {
  emit("delete-item", item);
  currentPage.value = 1;
}

function onDeleteMultipleItems() {
  emit("delete-multiple-items", selectedItems.value);
  selectedItems.value = [];
  changePageToFirst();
}

function onDeleteAllItems() {
  emit("delete-multiple-items", data.value);
  changePageToFirst();
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="custom-table">
      <thead>
        <tr>
          <th class="">
            <select v-model="itemsPerPage" @change="changeItemsPerPage">
              <option v-for="number in numberOfItemsPerPage" :key="number" :value="number">
                {{ number }}
              </option>
            </select>
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="min-w-fit w-[6%] p-2"
          >
            <div class="flex flex-col">
              <div class="flex flex-row justify-between">
                <p>{{ col.name }}</p>
                <span
                  v-if="col.sort"
                  class="cursor-pointer"
                  @click="sortData(col.key, sortDirection == 'asc' ? 'desc' : 'asc')"
                >
                  <ion-icon
                    name="caret-down-outline"
                    v-if="sortDirection == 'desc' && sortField == col.key"
                  ></ion-icon>
                  <ion-icon name="caret-up-outline" v-else></ion-icon>
                </span>
              </div>
              <input
                @keyup="changePageToFirst"
                class="px-3 mt-4 rounded focus:shadow text-sm border border-solid border-black"
                v-if="col.typeData === 'string'"
                v-model="searchTerms[col.key]"
                type="text"
                :placeholder="`Filtrer par ${col.name}`"
              />
              <input
                @keyup="changePageToFirst"
                class="px-3 mt-4 rounded focus:shadow text-sm border border-solid border-black"
                v-else-if="col.typeData === 'number'"
                v-model.number="searchTerms[col.key]"
                type="number"
                :placeholder="`Filtrer par ${col.name}`"
              />
              <input
                @change="changePageToFirst"
                class="px-3 mt-4 rounded focus:shadow text-sm border border-solid border-black"
                v-else-if="col.typeData === 'date'"
                v-model="searchTerms[col.key]"
                type="date"
                :placeholder="`Filtrer par ${col.name}`"
              />
            </div>
          </th>
          <th v-if="actions.edit || actions.delete || actions.visualize" class="min-w-fit text-centerk">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.name">
          <td class="w-[6%] text-center">
            <input type="checkbox" v-model="item.isSelected" @change="toggleSelection(item)" />
          </td>
          <td v-for="col in columns" :key="col.key" class="text-left">
            {{ formatValue(item[col.key], col.typeData) }}
          </td>
          <td v-if="actions.edit || actions.delete || actions.visualize">
            <div class="flex flex-col lg:flex-row lg:justify-around">
              <button
                v-if="actions.visualize"
                @click="onVisualize(item)"
                class="btn btn--small btn--primary"
                aria-label="Visualiser"
              >
                Visualiser
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="stroke-white dark:stroke-dark-blue">
                  <title>Visualiser</title>
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </g>
                </svg>
              </button>
              <button
                v-if="actions.edit"
                @click="onEdit(item)"
                class="btn btn--small btn--primary"
              >
                Modifier
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="fill-white dark:fill-dark-blue">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M8 12L7.46967 11.4697C7.32902 11.6103 7.25 11.8011 7.25 12H8ZM17 3L17.5303 2.46967C17.2374 2.17678 16.7626 2.17678 16.4697 2.46967L17 3ZM21 7L21.5303 7.53033C21.8232 7.23744 21.8232 6.76256 21.5303 6.46967L21 7ZM12 16V16.75C12.1989 16.75 12.3897 16.671 12.5303 16.5303L12 16ZM8 16H7.25C7.25 16.4142 7.58579 16.75 8 16.75V16ZM20 20L20 20.75C20.1989 20.75 20.3897 20.671 20.5303 20.5303C20.671 20.3897 20.75 20.1989 20.75 20H20ZM4 20L3.25 20C3.25 20.4142 3.58579 20.75 4 20.75L4 20ZM4 4L4 3.25C3.58579 3.25 3.25 3.58579 3.25 4L4 4ZM12 4.75C12.4142 4.75 12.75 4.41421 12.75 4C12.75 3.58579 12.4142 3.25 12 3.25L12 4.75ZM20.75 12C20.75 11.5858 20.4142 11.25 20 11.25C19.5858 11.25 19.25 11.5858 19.25 12H20.75ZM8.53033 12.5303L17.5303 3.53033L16.4697 2.46967L7.46967 11.4697L8.53033 12.5303ZM16.4697 3.53033L20.4697 7.53033L21.5303 6.46967L17.5303 2.46967L16.4697 3.53033ZM20.4697 6.46967L11.4697 15.4697L12.5303 16.5303L21.5303 7.53033L20.4697 6.46967ZM12 15.25H8V16.75H12V15.25ZM8.75 16V12H7.25V16H8.75ZM13.4697 6.53033L17.4697 10.5303L18.5303 9.46967L14.5303 5.46967L13.4697 6.53033ZM20 19.25L4 19.25L4 20.75L20 20.75L20 19.25ZM4.75 20L4.75 4L3.25 4L3.25 20L4.75 20ZM4 4.75L12 4.75L12 3.25L4 3.25L4 4.75ZM19.25 12V20H20.75V12H19.25Z"></path>
                  </g>
                </svg>
              </button>
              <button
                v-if="actions.delete"
                @click="onDelete(item)"
                class="btn btn--small btn--danger"
                aria-label="supprimer"
              >
                Supprimer
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="stroke-white dark:stroke-dark-blue">
                  <title>Supprimer</title>
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6M4 6H20M10 10V16M14 10V16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </g>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="columns.length + 2">
            <div class="w-full flex flex-col lg:flex-row lg:justify-between items-center p-4">
              <div class="flex flex-col items-start">
                <button
                  @click="onDeleteMultipleItems"
                  class="rounded p-2 mt-2"
                  :class="{
                    'bg-red-500 text-white': selectedItems.length > 0,
                    'disabled-button': selectedItems.length === 0,
                  }"
                >
                  Supprimer les éléments selectionnés
                </button>
                <button
                  @click="exportToCSV(selectedItems, columns)"
                  class="rounded p-2 mt-2"
                  :class="{
                    'bg-primary text-white': selectedItems.length > 0,
                    'disabled-button': selectedItems.length === 0,
                  }"
                >
                  Exporter les éléments selectionnés en CSV
                </button>
              </div>
              <div class="mt-4 lg:mt-0">
                <PaginationTable :page="pageInfo" @emitNextPage="nextPage" @emitPreviousPage="previousPage" />
              </div>
              <div class="flex flex-col items-end">
                <button
                  v-if="canDeleteAll"
                  @click="onDeleteAllItems"
                  class="rounded p-2 mt-2"
                  :class="{
                    'bg-red-500 text-white': data.length > 0,
                    'disabled-button': data.length === 0,
                  }"
                >
                  Supprimer tous les éléments
                </button>
                <button
                  @click="exportToCSV(paginatedData, columns)"
                  class="rounded p-2 mt-2"
                  :class="{
                    'bg-primary text-white': data.length > 0,
                    'disabled-button': data.length === 0,
                  }"
                >
                  Exporter toutes les données en CSV
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.disabled-button {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
  opacity: 2;
}
</style>
