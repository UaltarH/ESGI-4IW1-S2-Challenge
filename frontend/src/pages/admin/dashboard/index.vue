<script lang="ts" setup>
import { ref, nextTick, onMounted, Ref } from "vue";
import WidgetComponent from "./widget.vue";
import DialogContentCustom from "./modal.vue";
import btn from '@/components/ui/button/Button.vue'
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ModalResponse } from "./models/modalResponse.interface";
import { DashboardService } from "@/composables/api/dashboard/dashboard.service";
import { Widget } from "./models/widget.dto";
import { UpdateWidgetInput } from "@/composables/api/dashboard/dto/inputRequest/updateWidgetInput";

const grid = ref();
const widgets: Ref<Widget[]> = ref([]);
const dialogIsOpen = ref(false);

const dashboardService = DashboardService();


onMounted(async () => {
    await fetchWidgets();
    initGridStack();
});

async function fetchWidgets() {
    try {
        const response = await dashboardService.getWidgets();
        widgets.value = response.widgets;
    } catch (error) {
        console.error('Error fetching widgets:', error);            
    }
}

function initGridStack() {
    grid.value = GridStack.init({
        column: 12,
        cellHeight: 100,
        margin: 10,
        disableResize: false,
        disableDrag: false,
    });
    
    if(widgets.value.length > 0) makeWidgets(widgets.value);

    grid.value.on('change', handleGridChange);        
}
function handleGridChange(event: any, items: any[]) {        
    // items contains all th widgets that have been mooved or resized
    const bodyRequestUpdate: UpdateWidgetInput[] = items.reduce((acc, item) => {
    const widget = widgets.value.find(w => w.id === item.id);
    if (widget) {
        acc.push({
        idWidget: widget.id,
        grid: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
        },
        });
    }
    return acc;
    }, [] as UpdateWidgetInput[]);    
    saveWidgetChanges(bodyRequestUpdate);        
}    

function makeWidgets(widgets: Widget[]) {
    widgets.forEach((widget) => {
        makeWidget(widget);
    });
}
function makeWidget(item: Widget) {
    const elSelector = `#${item.id}`;        
    return grid.value.makeWidget(elSelector);
}

async function addWidget(dataWidget: ModalResponse) {
    closeDialog();

    try {        
        // used to get the position of the widget in the grid
        const tempWidgetId = `temp-${Date.now()}`;
        const tempWidgetHTML = `
            <div id="${tempWidgetId}" 
                    gs-w="${dataWidget.width[0]}" 
                    gs-h="${dataWidget.height[0]}">
                <div class="grid-stack-item-content">
                    Chargement...
                </div>
            </div>
        `;

        const gridItem = grid.value.addWidget(tempWidgetHTML);
        const { x, y } = gridItem.gridstackNode;

        const createWidgetInput = {
                title: dataWidget.title,
                description: dataWidget.description,
                chartType: dataWidget.type,
                dataSource: dataWidget.dataSource,
                indexField: dataWidget.indexField,
                categoryField1: dataWidget.categoryField1,
                w: dataWidget.width[0],
                h: dataWidget.height[0],
                x: x,
                y: y
            };

        const response = await dashboardService.createWidget(createWidgetInput);
        const newWidget = response.widget;
        
        grid.value.removeWidget(`#${tempWidgetId}`);
        widgets.value.push(newWidget);

        await nextTick();
        makeWidget(newWidget);
    } catch (error) {
        console.error('Error creating widget:', error);
    }
}

async function saveWidgetChanges(widgetsToUpdate: UpdateWidgetInput[]) {
    try {
        await dashboardService.updateWidgets(widgetsToUpdate);
    } catch (error) {
        console.error('Error saving widget changes:', error);
    }
}


async function deleteWidget(widget: Widget) {
    try {
        await dashboardService.deleteWidget(widget.id);

        const index = widgets.value.findIndex((w) => w.id === widget.id);
        if (index !== -1) {
            const selector = `#${CSS.escape(widget.id.toString())}`;
            grid.value.removeWidget(selector);
            grid.value.compact();
            widgets.value.splice(index, 1);
        }
    } catch (error) {
        console.error('Error deleting widget:', error);            
    }
}

function openDialog(){
    dialogIsOpen.value = true;
}

function closeDialog(){
    dialogIsOpen.value = false;
}

</script>

<template>
    <div>
        <h1>Compta Dashboard</h1>
    </div>

    <div class="p-8 bg-gray-50 min-h-screen">
      <div class="py-2 px-2.5 flex justify-end space-x-2">
        <!-- <btn v-if="isEditing" @click="addWidget">Ajouter</btn> -->
        <Dialog v-model="dialogIsOpen">
            <DialogTrigger as-child>
                <btn variant="outline" @click="openDialog">
                    Ajouter un graphique
                </btn>
            </DialogTrigger>
            <DialogContentCustom @submitCreation="addWidget"></DialogContentCustom>
        </Dialog>
      </div>
      <div class="grid-stack">
        <WidgetComponent
          v-for="widget in widgets"
          :key="widget.id"
          :data="widget"
          :is-editing="true"
          @delete="deleteWidget"
        />
      </div>
    </div>
</template>