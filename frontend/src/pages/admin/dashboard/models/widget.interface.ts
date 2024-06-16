export interface Widget {
    id: number;
    title: string;
    grid: {
        [key: string]: number;
    };
}