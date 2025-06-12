"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { inPersonLeadSchema, type InPersonFormData } from "./LeadFormSchema";
import { saveLeadAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormCommonFields from "./shared/FormCommonFields";
import type { InPersonArrivalMethod } from "@/types";

const arrivalMethodOptions: { value: InPersonArrivalMethod; label: string }[] = [
    { value: "Paso casual", label: "Pasó casualmente por el local" },
    { value: "Medio de comunicación", label: "Vio un anuncio (TV, radio, prensa)" },
    { value: "Google", label: "Encontró en Google (Maps, búsqueda)" },
    { value: "Recomendación", label: "Por recomendación de alguien" },
];


export default function InPersonForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<InPersonFormData>({
    resolver: zodResolver(inPersonLeadSchema),
    defaultValues: {
      channelType: "Presencial",
      arrivalMethod: undefined,
      interestLevel: undefined,
      comment: "",
      salonName: "",
      userName: "",
    },
  });

  async function onSubmit(data: InPersonFormData) {
    const result = await saveLeadAction(data);
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      });
      form.reset();
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Registrar Consulta Presencial</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="arrivalMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cómo llegó al salón?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {arrivalMethodOptions.map(option => (
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
            
            <FormCommonFields control={form.control} />

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Registrando..." : "Registrar consulta"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
