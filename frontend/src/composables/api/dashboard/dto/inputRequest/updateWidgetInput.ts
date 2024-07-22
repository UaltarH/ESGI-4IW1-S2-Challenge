export interface UpdateWidgetInput {
    idWidget: string;
    grid: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}