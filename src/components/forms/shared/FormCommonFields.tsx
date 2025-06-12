import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Flame, Sun, Snowflake } from "lucide-react";
import type { InterestLevel } from "@/types";

interface FormCommonFieldsProps {
  control: Control<any>; // Using any for control due to different form types
}

const interestOptions: { value: InterestLevel; label: string; icon: React.ElementType }[] = [
  { value: "caliente", label: "Lead caliente", icon: Flame },
  { value: "templado", label: "Lead templado", icon: Sun },
  { value: "frío", label: "Lead frío", icon: Snowflake },
];

export default function FormCommonFields({ control }: FormCommonFieldsProps) {
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
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
            <FormLabel>Descripción de la consulta (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ingrese detalles adicionales sobre la consulta..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="salonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salón del usuario</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del salón" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
