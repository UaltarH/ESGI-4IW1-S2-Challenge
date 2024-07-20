export interface CreateWidgetInput {    
    title: string;
    description: string;
    chartType: string;
    dataSource: string;
    indexField: string;
    categoryField1: string;
    w: number;
    h: number;
}