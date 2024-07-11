import {Component} from "vue";

export interface Notification {
    message: string;
    timeout: number;
    type: 'success' | 'error' | 'info';
    component?: Component;
}