
"use client";

import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
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
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface FormCommonFieldsProps {
  control: Control<any>;
  channelType: ChannelType;
}

const interestOptions: { value: InterestLevel; label: string; icon: React.ElementType }[] = [
  { value: "caliente", label: "Muy interesado", icon: Flame },
  { value: "templado", label: "Interesado", icon: Sun },
  { value: "frío", label: "Desinteresado", icon: Snowflake },
  { value: "erroneo", label: "Erroneo/Equivocado", icon: XCircle },
];

const callSourceOptions: { value: CallSource; label: string }[] = [
  { value: "Google", label: "Google" },
  { value: "Ya es cliente", label: "Ya es cliente" },
  { value: "Recomendación", label: "Recomendación" },
  { value: "Otro", label: "Otro" },
];

export default function FormCommonFields({ control, channelType }: FormCommonFieldsProps) {
  const { watch, setValue } = useFormContext();
  const { user, salon, userName } = useAuth();
  const watchedSource = watch("source");

  // Effect to auto-populate hidden fields from auth context
  useEffect(() => {
    if (user) {
      setValue("salonName", salon, { shouldValidate: true });
      setValue("userName", userName, { shouldValidate: true });
    }
  }, [user, salon, userName, setValue]);

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

      {/* The Salon and Vendedor fields are now hidden and will be auto-populated */}
      <FormField control={control} name="salonName" render={() => <Input type="hidden" />} />
      <FormField control={control} name="userName" render={() => <Input type="hidden" />} />
    </>
  );
}
