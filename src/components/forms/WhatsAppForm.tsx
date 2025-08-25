
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { whatsAppLeadSchema, type WhatsAppFormData } from "./LeadFormSchema";
import { saveLeadAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormCommonFields from "./shared/FormCommonFields";
import type { WhatsAppSubChannel } from "@/types";
import { Globe, MessageSquare } from 'lucide-react';
import React from "react";
import { useAuth } from "@/context/AuthContext";

const subChannelOptions: { value: WhatsAppSubChannel; label: string; icon: React.ElementType }[] = [
  { value: "Meta Ads", label: "Meta Ads", icon: MessageSquare },
  { value: "No identificado", label: "No identificado", icon: Globe },
];

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-500"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.054l-1.212 4.433 4.57-1.196z" />
  </svg>
);

export default function WhatsAppForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { salon, userName, user } = useAuth(); // Get auth context

  const form = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsAppLeadSchema),
  });

  // Set default values once user data is available
  React.useEffect(() => {
    if (user) {
      form.reset({
        channelType: "WhatsApp",
        subChannel: undefined,
        interestLevel: undefined,
        comment: "",
        salonName: salon || undefined, // Set salon from context
        userName: userName || "",       // Set userName from context
      });
    }
  }, [user, salon, userName, form]);

  async function onSubmit(data: WhatsAppFormData) {
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
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <WhatsAppIcon />
            Registrar Consulta WhatsApp
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="subChannel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Subcanal de origen</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {subChannelOptions.map((option) => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                            <RadioGroupItem value={option.value} id={`subchannel-${option.value}`} className="peer sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor={`subchannel-${option.value}`}
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
            <FormCommonFields control={form.control} channelType="WhatsApp" />
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
