"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { callLeadSchema, type CallFormData } from "./LeadFormSchema";
import { saveLeadAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormCommonFields from "./shared/FormCommonFields";
import type { CallSource } from "@/types";

const callSourceOptions: { value: CallSource; label: string }[] = [
  { value: "Google", label: "Google" },
  { value: "Ya es cliente", label: "Ya es cliente" },
  { value: "Recomendación", label: "Recomendación" },
  { value: "Otro", label: "Otro" },
];

export default function CallForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CallFormData>({
    resolver: zodResolver(callLeadSchema),
    defaultValues: {
      channelType: "Llamada",
      source: undefined,
      otherSourceDetail: "",
      interestLevel: undefined,
      comment: "",
      salonName: "",
      userName: "",
    },
  });

  const watchedSource = form.watch("source");

  async function onSubmit(data: CallFormData) {
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
        <CardTitle className="font-headline text-2xl">Registrar Consulta por Llamada</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cómo conoció la empresa?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
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
                control={form.control}
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
