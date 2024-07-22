<template>
    <DialogContent class="w-3/4">
        <DialogHeader>
          <DialogTitle>Ajout d'un graphique</DialogTitle>
          <DialogDescription>
            Choisissez le type de graphique que vous souhaitez ajouter, avec les options de configuration.
          </DialogDescription>
        </DialogHeader>
        <form @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="title" class="m-5">
              <FormItem>
                <FormLabel>Nom de votre graphique</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="description" class="m-5">
                <FormItem>
                  <FormLabel>description de votre graphique</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, value }" name="width" class="m-5">
                <FormItem>
                  <FormLabel>Largeur de votre carte</FormLabel>
                  <FormControl>
                    <Slider
                      v-bind="componentField"
                      :default-value="[3]"
                      :max="12"
                      :min="3"
                      :step="1"
                    />
                    <FormDescription class="flex justify-between">
                      <span>Definition de la largeur de votre carte, modifiable par la suite</span>
                      <span>{{ value?.[0] }}</span>
                    </FormDescription>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            </FormField>
            
            <FormField v-slot="{ componentField, value }" name="height" class="m-5">
                <FormItem>
                  <FormLabel>Hauteur de votre carte</FormLabel>
                  <FormControl>
                    <Slider
                      v-bind="componentField"
                      :default-value="[5]"
                      :max="8"
                      :min="5"
                      :step="1"
                    />
                    <FormDescription class="flex justify-between">
                      <span>Definition de la hauteur de votre carte, modifiable par la suite</span>
                      <span>{{ value?.[0] }}</span>
                    </FormDescription>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="type" class="m-5">
                <FormItem>
                  <FormLabel>Type de graphique</FormLabel>
          
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner le type de graphique" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="area">
                            graphique en aires
                        </SelectItem>
                        <SelectItem value="line">
                            graphique en ligne
                        </SelectItem>
                        <SelectItem value="bar">
                            graphique en barres
                        </SelectItem>                        
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="dataSource" class="m-5">
              <FormItem>
                <FormLabel>Source de données</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la source de données" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="orders">Commandes</SelectItem>
                      <SelectItem value="products">Produits</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="indexField" class="m-5">
              <FormItem>
                <FormLabel>Champ pour l'index (axe X)</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le champ index" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup v-if="form.values.dataSource === 'orders'">
                      <SelectItem value="date">Date</SelectItem>
                    </SelectGroup>
                    <SelectGroup v-else-if="form.values.dataSource === 'products'">
                      <SelectItem value="name">Nom du produit</SelectItem>
                      <SelectItem value="categoryName">Catégorie</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
            
            <FormField v-slot="{ componentField }" name="categoryField1" class="m-5">
              <FormItem>
                <FormLabel>Catégorie 1</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la première catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup v-if="form.values.dataSource === 'orders'">
                      <SelectItem value="totalAmount">Montant total</SelectItem>
                      <SelectItem value="orderCount">Nombre de commandes</SelectItem>
                    </SelectGroup>
                    <SelectGroup v-else-if="form.values.dataSource === 'products'">
                      <SelectItem value="price">Prix</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>            
             <div class="w-full flex justify-center items-center mt-6">
                 <DialogClose as-child>
                     <Button type="submit">
                       Créer
                     </Button>
                 </DialogClose>
             </div>
        </form>
        <DialogFooter>
          
        </DialogFooter>
      </DialogContent>
</template>
<script lang="ts" setup>
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const emit = defineEmits(["submitCreation"]);

const formSchema = toTypedSchema(z.object({
    title: z.string(
        {
            required_error: 'Veuillez renseigner un titre entre 5 et 25 caractères',
        }
    ).min(5, {message: "le titre doit contenir au moins 5 caractères"}).max(25, {message: "le titre doit contenir au maximum 25 caractères"}),
    description: z.string(
        {
            required_error: 'Veuillez renseigner une description entre 5 et 200 caractères',
        }
    ).min(5, {message: "la description doit contenir au moins 5 caractères"}).max(200, {message: "la description doit contenir au maximum 200 caractères"}),
    width: z.array(z.number(
        {
            required_error: 'Veuillez renseigner une largeur entre 3 et 12',
        })
        .min(3).max(12)),
    height: z.array(z.number(
        {
            required_error: 'Veuillez renseigner une hauteur entre 5 et 8',
        }).min(5).max(8)
    ),
    type: z.enum(['area', 'line', 'bar'], 
        {
            required_error: 'Veuillez selectionner un type de graphique',
        }
    ),
    dataSource: z.enum(['orders', 'products'], 
        {
            required_error: 'Veuillez selectionner une source de données',
        }
    ),
    indexField: z.enum(['date', 'name', 'categoryName'], 
        {
            required_error: 'Veuillez selectionner un champ',
        }
    ),
    categoryField1: z.enum(['totalAmount', 'orderCount', 'price', 'stock'], 
        {
            required_error: 'Veuillez selectionner un champ',
        }
    ),
}))

const form = useForm({
  validationSchema: formSchema,
    initialValues: {
        width: [3],
        height: [5],
    },
})

const onSubmit = form.handleSubmit((values) => {
  emit("submitCreation", values);
})

</script>