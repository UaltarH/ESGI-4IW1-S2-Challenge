import {FormField} from "@/dto/formField.dto.ts";
import {z, ZodObject} from "zod";
import {Ref} from "vue";

export const useForm = (formSchema: Ref<FormField<any>[]>) => {
    const getValidationSchema = ()=> {
        let schema:ZodObject<any> = z.object({});
        formSchema.value.forEach((item) => {
            schema = schema.merge(item.schema);
        });
        return schema;
    }
    const getFieldValues = () => {
        let values:{[key:string] : string|undefined|number|Date} = {};
        formSchema.value.forEach((item) => {
            values[item.name] = item.value;
        });
        return values;
    }
    const getFieldShape = (name: string) => {
        const formItem = formSchema.value.find((item) => item.name == name);
        if(typeof formItem == "undefined") {
            throw new Error(`Field ${name} not found`);
        }
        const schema = formItem.schema;
        return schema.shape[name];
    }
    const getFieldRequired = (name: string): boolean => {
        return !getFieldShape(name).isOptional();
    }
    const getFieldMin = (name: string): number|null => {
        return getFieldShape(name).minLength;
    }
    const getFieldMax = (name: string): number|null => {
        return getFieldShape(name).maxLength;
    }
    function validateField (item: FormField<any>): boolean {
        console.log(`Validating ${item.name}`);
        console.log(`Value: ${item.value}`)
        item.error = "";
        const res = item.schema.safeParse({[item.name]: item.value});
        console.log(res);
        if(!res.success) {
            item.error = res.error.issues[0].message;
            console.log(res.error.issues)
            console.log('schema invalid');
            return false;
        }
        if(item.dependsOn !== undefined) {
            const dependency = formSchema.value.find((field) => field.name == item.dependsOn!.field);
            if(typeof dependency == "undefined") {
                throw new Error(`Dependent field ${item.dependsOn} not found`);
            }
            if(dependency.value !== item.value) {
                console.log('schema invalid : depends');
                item.error = item.dependsOn.errorMessage;
                return false;
            }
        }
        console.log('schema valid');
        return true;
    }
    function validate(): boolean {
        console.log("Validating form");
        let res = getValidationSchema().safeParse(getFieldValues());
        console.log(res);
        if(!res.success) {
            for (const issue of res.error.issues) {
                const field =  formSchema.value.find((item) => {
                    return item.name == issue.path[0];
                })
                if(typeof field != "undefined") {
                    field.error = issue.message;
                }
            }
            return false;
        }
        return true;
    }
    return {getValidationSchema, getFieldValues, getFieldRequired, getFieldMin, getFieldMax, validateField, validate};
}