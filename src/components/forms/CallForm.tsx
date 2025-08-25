
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { callLeadSchema, type CallFormData } from "./LeadFormSchema";
import { saveLeadAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormCommonFields from "./shared/FormCommonFields";

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
      salonName: undefined,
      userName: "",
    },
  });

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
            <FormCommonFields control={form.control} channelType="Llamada" />
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
