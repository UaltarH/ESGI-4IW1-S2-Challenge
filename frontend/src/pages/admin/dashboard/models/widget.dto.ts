export interface Widget {
    id: string;
    title: string;
    description: string;
    chartType: string;
    dataSource: string;
    indexData: string;
    categoriesData: string[];
    data: any[];
    grid: {
        [key: string]: number;
    };    
}