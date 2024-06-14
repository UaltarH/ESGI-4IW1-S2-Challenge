import {ZodObject} from "zod";

export interface FormSchema {
    label: string;
    component: string;
    type: string;
    name: string;
    placeholder: string;
    value?: string | undefined;
    error?: string | undefined;
    options?: string[] | undefined;
    schema: ZodObject<any>;
    col?: number | undefined;
    dependsOn?: {field: string, errorMessage: string} | undefined;
}