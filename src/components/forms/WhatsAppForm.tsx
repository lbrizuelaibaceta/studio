
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
import { ShoppingBag, Store, Globe } from 'lucide-react';

const subChannelOptions: { value: WhatsAppSubChannel; label: string; icon: React.ElementType }[] = [
  { value: "Meta Ads", label: "Meta Ads", icon: ShoppingBag },
  { value: "Facebook Marketplace", label: "Facebook Marketplace", icon: Store },
  { value: "Página web / Google", label: "Página web / Google", icon: Globe },
];

export default function WhatsAppForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsAppLeadSchema),
    defaultValues: {
      channelType: "WhatsApp",
      subChannel: undefined,
      interestLevel: undefined,
      comment: "",
      salonName: undefined,
      userName: "",
    },
  });

  async function onSubmit(data: WhatsAppFormData) {
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
        <CardTitle className="font-headline text-2xl">Registrar Consulta WhatsApp</CardTitle>
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
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
