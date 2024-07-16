<script lang="ts" setup>
    import { ref, nextTick, onMounted, Ref } from "vue";
    import WidgetComponent from "./widget.vue";
    import DialogContentCustom from "./modal.vue";
    import btn from '@/components/ui/button/Button.vue'
    import { Widget } from "./models/widget.interface";
    import { GridStack } from "gridstack";
    import "gridstack/dist/gridstack.min.css";
    import "gridstack/dist/gridstack-extra.min.css";
    import { v4 as uuidv4 } from 'uuid';
    import { Dialog, DialogTrigger } from '@/components/ui/dialog';
    import { ModalResponse } from "./models/modalResponse.interface";
    
    const grid = ref();
    const widgets: Ref<Widget[]> = ref([
        // {
        //     id: 1,
        //     title: "Widget 1",
        //     grid: {
        //         x: 0,
        //         y: 0,
        //         w: 6,
        //         h: 2,
        //         },
        // },
        // {
        //     id: 2,
        //     title: "Widget 2",
        //     grid: {
        //         x: 2,
        //         y: 0,
        //         w: 6,
        //         h: 1,
        //     },
        // },
        // {
        //     id: 3,
        //     title: "Widget 3",
        //     grid: {
        //         x: 0,
        //         y: 2,
        //         w: 6,
        //         h: 1,
        //     },
        // },
        // {
        //     id: 4,
        //     title: "Widget 4",
        //     grid: {
        //         x: 2,
        //         y: 2,
        //         w: 3,
        //         h: 6,
        //     },
        // },
        // {
        //     id: 5,
        //     title: "Widget 5",
        //     grid: {
        //         x: 3,
        //         y: 2,
        //         w: 3,
        //         h: 5,
        //         // minWidth: 0,
        //         // minHeight: 0,
        //         // maxWidth: 0,
        //         // maxHeight: 0,
        //     },
        // },
    ]);
    const isEditing = ref(true); 
    const dialogIsOpen = ref(false);

    onMounted(() => {
        initGridStack();
    });

    function initGridStack() {
        grid.value = GridStack.init({
            column: 12,
            cellHeight: 100,
            margin: 10,
            disableResize: !isEditing.value,
            disableDrag: !isEditing.value,
        });
        if(widgets.value.length > 0) makeWidgets(widgets.value);
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
        closeDialog()
        let index = "";
        let categories: string[] = [];
        let data: any = [];
        if(dataWidget.type == "area" || dataWidget.type == "donut" || dataWidget.type == "bar"){
            index = "name";
            categories = ["total", "predicted"];
            data = [
                { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
                { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
            ];
        } else if(dataWidget.type == "line"){
            index = "year";
            categories = ['Export Growth Rate', 'Import Growth Rate'];
            data = [
                    {
                        'year': 1970,
                        'Export Growth Rate': 2.04,
                        'Import Growth Rate': 1.53,
                    },
                    {
                        'year': 1971,
                        'Export Growth Rate': 1.96,
                        'Import Growth Rate': 1.58,
                    },
                    {
                        'year': 1972,
                        'Export Growth Rate': 1.96,
                        'Import Growth Rate': 1.61,
                    },
                    {
                        'year': 1973,
                        'Export Growth Rate': 1.93,
                        'Import Growth Rate': 1.61,
                    },
                    {
                        'year': 1974,
                        'Export Growth Rate': 1.88,
                        'Import Growth Rate': 1.67,
                    },
                    {
                        'year': 1975,
                        'Export Growth Rate': 1.79,
                        'Import Growth Rate': 1.64,
                    },
                    {
                        'year': 1976,
                        'Export Growth Rate': 1.77,
                        'Import Growth Rate': 1.62,
                    },
                    {
                        'year': 1977,
                        'Export Growth Rate': 1.74,
                        'Import Growth Rate': 1.69,
                    },
                    {
                        'year': 1978,
                        'Export Growth Rate': 1.74,
                        'Import Growth Rate': 1.7,
                    },
                    {
                        'year': 1979,
                        'Export Growth Rate': 1.77,
                        'Import Growth Rate': 1.67,
                    },
                    {
                        'year': 1980,
                        'Export Growth Rate': 1.79,
                        'Import Growth Rate': 1.7,
                    },
                    {
                        'year': 1981,
                        'Export Growth Rate': 1.81,
                        'Import Growth Rate': 1.72,
                    },
                    {
                        'year': 1982,
                        'Export Growth Rate': 1.84,
                        'Import Growth Rate': 1.73,
                    },
                    {
                        'year': 1983,
                        'Export Growth Rate': 1.77,
                        'Import Growth Rate': 1.73,
                    },
                    {
                        'year': 1984,
                        'Export Growth Rate': 1.78,
                        'Import Growth Rate': 1.78,
                    },
                    {
                        'year': 1985,
                        'Export Growth Rate': 1.78,
                        'Import Growth Rate': 1.81,
                    },
                    {
                        'year': 1986,
                        'Export Growth Rate': 1.82,
                        'Import Growth Rate': 1.89,
                    },
                    {
                        'year': 1987,
                        'Export Growth Rate': 1.82,
                        'Import Growth Rate': 1.91,
                    },
                    {
                        'year': 1988,
                        'Export Growth Rate': 1.77,
                        'Import Growth Rate': 1.94,
                    },
                    {
                        'year': 1989,
                        'Export Growth Rate': 1.76,
                        'Import Growth Rate': 1.94,
                    },
                    {
                        'year': 1990,
                        'Export Growth Rate': 1.75,
                        'Import Growth Rate': 1.97,
                    },
                    {
                        'year': 1991,
                        'Export Growth Rate': 1.62,
                        'Import Growth Rate': 1.99,
                    },
                    {
                        'year': 1992,
                        'Export Growth Rate': 1.56,
                        'Import Growth Rate': 2.12,
                    },
                    {
                        'year': 1993,
                        'Export Growth Rate': 1.5,
                        'Import Growth Rate': 2.13,
                    },
                    {
                        'year': 1994,
                        'Export Growth Rate': 1.46,
                        'Import Growth Rate': 2.15,
                    },
                    {
                        'year': 1995,
                        'Export Growth Rate': 1.43,
                        'Import Growth Rate': 2.17,
                    },
                    {
                        'year': 1996,
                        'Export Growth Rate': 1.4,
                        'Import Growth Rate': 2.2,
                    },
                    {
                        'year': 1997,
                        'Export Growth Rate': 1.37,
                        'Import Growth Rate': 2.15,
                    },
                    {
                        'year': 1998,
                        'Export Growth Rate': 1.34,
                        'Import Growth Rate': 2.07,
                    },
                    {
                        'year': 1999,
                        'Export Growth Rate': 1.32,
                        'Import Growth Rate': 2.05,
                    },
                    {
                        'year': 2000,
                        'Export Growth Rate': 1.33,
                        'Import Growth Rate': 2.07,
                    },
                    {
                        'year': 2001,
                        'Export Growth Rate': 1.31,
                        'Import Growth Rate': 2.08,
                    },
                    {
                        'year': 2002,
                        'Export Growth Rate': 1.29,
                        'Import Growth Rate': 2.1,
                    },
                    {
                        'year': 2003,
                        'Export Growth Rate': 1.27,
                        'Import Growth Rate': 2.15,
                    },
                    {
                        'year': 2004,
                        'Export Growth Rate': 1.27,
                        'Import Growth Rate': 2.21,
                    },
                    {
                        'year': 2005,
                        'Export Growth Rate': 1.26,
                        'Import Growth Rate': 2.23,
                    },
                    {
                        'year': 2006,
                        'Export Growth Rate': 1.26,
                        'Import Growth Rate': 2.29,
                    },
                    {
                        'year': 2007,
                        'Export Growth Rate': 1.27,
                        'Import Growth Rate': 2.34,
                    },
                    {
                        'year': 2008,
                        'Export Growth Rate': 1.26,
                        'Import Growth Rate': 2.36,
                    },
                    {
                        'year': 2009,
                        'Export Growth Rate': 1.26,
                        'Import Growth Rate': 2.36,
                    },
                    {
                        'year': 2010,
                        'Export Growth Rate': 1.25,
                        'Import Growth Rate': 2.35,
                    },
                    {
                        'year': 2011,
                        'Export Growth Rate': 1.24,
                        'Import Growth Rate': 2.34,
                    },
                    {
                        'year': 2012,
                        'Export Growth Rate': 1.25,
                        'Import Growth Rate': 2.39,
                    },
                    {
                        'year': 2013,
                        'Export Growth Rate': 1.22,
                        'Import Growth Rate': 2.3,
                    },
                    {
                        'year': 2014,
                        'Export Growth Rate': 1.2,
                        'Import Growth Rate': 2.35,
                    },
                    {
                        'year': 2015,
                        'Export Growth Rate': 1.17,
                        'Import Growth Rate': 2.39,
                    },
                    {
                        'year': 2016,
                        'Export Growth Rate': 1.16,
                        'Import Growth Rate': 2.41,
                    },
                    {
                        'year': 2017,
                        'Export Growth Rate': 1.13,
                        'Import Growth Rate': 2.44,
                    },
                    {
                        'year': 2018,
                        'Export Growth Rate': 1.07,
                        'Import Growth Rate': 2.45,
                    },
                    {
                        'year': 2019,
                        'Export Growth Rate': 1.03,
                        'Import Growth Rate': 2.47,
                    },
                    {
                        'year': 2020,
                        'Export Growth Rate': 0.92,
                        'Import Growth Rate': 2.48,
                    },
                    {
                        'year': 2021,
                        'Export Growth Rate': 0.82,
                        'Import Growth Rate': 2.51,
                    },
            ];
        }

        const widget = {
            id: uuidv4(),
            title: dataWidget.title,
            description: dataWidget.description,
            chartType: dataWidget.type,
            data: data,
            indexData: index,
            categoriesData: categories,
            grid: {
                w: dataWidget.width[0],
                h: dataWidget.height[0],
                maxH: 8,
                minH: 5,
                maxW: 12,
                minW: 3,
            },
        } as Widget;
        console.log(widget);
        widgets.value.push(widget);
        await nextTick();
        makeWidget(widget);
        }
    
    function deleteWidget(widget: Widget) {
        const index = widgets.value.findIndex((w) => w.id === widget.id);
        if (index === -1) {
            return;
        }
        const selector = `#${CSS.escape(widget.id.toString())}`;
        grid.value.removeWidget(selector);
        grid.value.compact();
        widgets.value.splice(index, 1);
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
          :is-editing="isEditing"
          @delete="deleteWidget"
        />
      </div>
    </div>
</template>