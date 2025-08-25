
"use client";

import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Flame, Sun, Snowflake, XCircle } from "lucide-react";
import type { InterestLevel, CallSource, ChannelType } from "@/types";
import { salonNames, type SalonName } from "../LeadFormSchema";
import { useFormContext } from "react-hook-form";


interface FormCommonFieldsProps {
  control: Control<any>; // Using any for control due to different form types
  channelType: ChannelType;
}

const interestOptions: { value: InterestLevel; label: string; icon: React.ElementType }[] = [
  { value: "caliente", label: "Muy interesado", icon: Flame },
  { value: "templado", label: "Interesado", icon: Sun },
  { value: "frío", label: "Desinteresado", icon: Snowflake },
  { value: "erroneo", label: "Erroneo/Equivocado", icon: XCircle },
];

const salonOptions: { value: SalonName; label: string }[] = salonNames.map(name => ({ value: name, label: name }));

const callSourceOptions: { value: CallSource; label: string }[] = [
  { value: "Google", label: "Google" },
  { value: "Ya es cliente", label: "Ya es cliente" },
  { value: "Recomendación", label: "Recomendación" },
  { value: "Otro", label: "Otro" },
];


export default function FormCommonFields({ control, channelType }: FormCommonFieldsProps) {
  const { watch } = useFormContext();
  const watchedSource = watch("source");

  return (
    <>
      <FormField
        control={control}
        name="interestLevel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Nivel de interés</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {interestOptions.map((option) => (
                  <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={option.value} id={`interest-${option.value}`} className="peer sr-only" />
                    </FormControl>
                    <FormLabel
                      htmlFor={`interest-${option.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer"
                    >
                      <option.icon className="mb-2 h-6 w-6" />
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción de la consulta</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: Consulta por exhibidora vertical Briket 5000..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {channelType === 'Llamada' && (
        <>
          <FormField
            control={control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Cómo conoció la empresa?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {callSourceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedSource === "Otro" && (
            <FormField
              control={control}
              name="otherSourceDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especifique el otro medio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Anuncio en revista, volante, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="salonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salón</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un salón" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendedor</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del vendedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
