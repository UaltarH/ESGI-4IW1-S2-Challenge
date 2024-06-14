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
  <div>
    <table class="border-collapse w-full">
      <thead>
        <tr>
          <th class="border border-solid border-black p-2">
            <select v-model="itemsPerPage" @change="changeItemsPerPage">
              <option
                v-for="number in numberOfItemsPerPage"
                :key="number"
                :value="number"
              >
                {{ number }}
              </option>
            </select>
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="min-w-fit w-[6%] p-2 border border-solid border-black"
          >
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
          <th
            v-if="actions.edit || actions.delete"
            class="min-w-fit p-2 text-center border border-solid border-black"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.name">
          <td class="w-[6%] p-2 text-center border border-solid border-black">
            <input
              type="checkbox"
              v-model="item.isSelected"
              @change="toggleSelection(item)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            class="p-2 text-left border border-solid border-black"
          >
            {{ formatValue(item[col.key], col.typeData) }}
          </td>
          <td
            v-if="actions.edit || actions.delete"
            class="p-2 border border-solid border-black"
          >
            <div class="flex flex-row justify-around">
              <button
                v-if="actions.visualize"
                @click="onVisualize(item)"
                class="bg-primary text-white rounded-sm p-1.5 m-1"
              >
                <p>Visualiser</p>
              </button>

              <button
                v-if="actions.edit"
                @click="onEdit(item)"
                class="bg-primary text-white rounded-sm p-1.5 m-1"
              >
                <p>Modifier</p>
              </button>
              <button
                v-if="actions.delete"
                @click="onDelete(item)"
                class="bg-primary text-white rounded-sm p-1.5 m-1"
              >
                <p>Supprimer</p>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="columns.length + 2">
            <div class="w-full flex flex-row justify-between items-center">
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

              <div>
                <PaginationTable
                  :page="pageInfo"
                  @emitNextPage="nextPage"
                  @emitPreviousPage="previousPage"
                />
              </div>

              <div class="flex flex-col items-end">
                <button
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
