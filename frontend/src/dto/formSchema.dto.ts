import {ZodSchema} from "zod";

export interface FormSchema<Schema extends ZodSchema<any>> {
    label: string;
    component: string;
    type: string;
    name: string;
    placeholder: string;
    value?: string | undefined;
    error?: string | undefined;
    options?: string[] | undefined;
    schema: Schema;
    col?: number | undefined;
    dependsOn?: {field: string, errorMessage: string} | undefined;
}