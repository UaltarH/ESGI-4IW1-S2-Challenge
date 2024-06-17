export interface Widget {
    id: number;
    title: string;
    grid: {
        [key: string]: number;
    };
    chartType: string;
    description: string;
    data: any;
    indexData: any;
    categoriesData: any;
}