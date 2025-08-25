
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
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function CallForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { salon, userName, user } = useAuth(); // Get salon and userName from AuthContext

  const form = useForm<CallFormData>({
    resolver: zodResolver(callLeadSchema),
    // Default values are now set dynamically using useEffect
  });

  // Set default values once user data is available from context
  React.useEffect(() => {
    if (user) {
      form.reset({
        channelType: "Llamada",
        source: undefined,
        otherSourceDetail: "",
        interestLevel: undefined,
        comment: "",
        salonName: salon || undefined, // Set salon from context
        userName: userName || "",       // Set userName from context
      });
    }
  }, [user, salon, userName, form]);


  async function onSubmit(data: CallFormData) {
    const result = await saveLeadAction(data);
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      });
      form.reset();
      router.push("/new-query");
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
            <Button type="submit" disabled={form.formState.isSubmitting || !user} className="w-full">
              {form.formState.isSubmitting ? "Registrando..." : "Registrar consulta"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
