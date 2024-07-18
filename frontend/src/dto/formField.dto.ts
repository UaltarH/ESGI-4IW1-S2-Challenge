import { ZodObject } from "zod";

export interface FormField<FieldSchema extends ZodObject<any>> {
    label: string;
    component: string;
    type: string;
    name: string;
    placeholder: string;
    optionsSelect?: {value: string, label:string}[] | undefined;
    value?: string | undefined;
    error?: string | undefined;
    options?: string[] | undefined;
    schema: FieldSchema;
    col?: number | undefined;
    dependsOn?: {field: string, errorMessage: string} | undefined;
    disabled?: boolean | undefined;
}