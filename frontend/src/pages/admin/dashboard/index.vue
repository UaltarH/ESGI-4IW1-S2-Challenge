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
        grid.value.on('resizestop', handleGridResizeStop);
    }
    function handleGridChange(event: any, items: any[]) {
        console.log('handleGridChange', items);
        // items.forEach(item => {
        //     const widget = widgets.value.find(w => w.id === item.id);
        //     if (widget) {
        //         widget.grid = {
        //             x: item.x,
        //             y: item.y,
        //             w: item.w,
        //             h: item.h
        //         };
        //     }
        // });
        // Ici, vous pouvez appeler une fonction pour sauvegarder les changements
        // saveWidgetChanges();
    }

    function handleGridResizeStop(event: any, item: any) {
        console.log('handleGridResizeStop', item);
        // const widget = widgets.value.find(w => w.id === item.id);
        // if (widget) {
        //     widget.grid = {
        //         x: item.x,
        //         y: item.y,
        //         w: item.w,
        //         h: item.h
        //     };
            // Ici, vous pouvez appeler une fonction pour sauvegarder les changements
            // saveWidgetChanges();
        // }
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
            const createWidgetInput = {
                title: dataWidget.title,
                description: dataWidget.description,
                chartType: dataWidget.type,
                dataSource: dataWidget.dataSource,
                indexField: dataWidget.indexField,
                categoryField1: dataWidget.categoryField1,
                w: dataWidget.width[0],
                h: dataWidget.height[0]
            };

            const response = await dashboardService.createWidget(createWidgetInput);
            const newWidget = response.widget;            
            widgets.value.push(newWidget);
            await nextTick();
            makeWidget(newWidget);
        } catch (error) {
            console.error('Error creating widget:', error);
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