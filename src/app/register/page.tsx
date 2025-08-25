
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { salonNames } from "@/components/forms/LeadFormSchema";
import { UserPlus } from "lucide-react";

const registerSchema = z.object({
  userName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  salonName: z.enum(salonNames, { required_error: "Por favor, seleccione un salón." }),
  email: z.string().email({ message: "Por favor, ingrese un email válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      salonName: undefined,
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data.email, data.password, data.userName, data.salonName);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Ahora serás redirigido.",
      });
      // The ProtectedRoute will handle redirection after login state changes.
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Ocurrió un error desconocido durante el registro.";

      // Provide more specific feedback based on Firebase error codes
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Este email ya está registrado. Por favor, intente con otro.";
            break;
          case 'auth/weak-password':
            errorMessage = "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
            break;
          case 'auth/invalid-email':
            errorMessage = "El formato del email no es válido.";
            break;
          case 'permission-denied':
          case 'storage/unauthorized':
             errorMessage = "Error de permisos. Contacte al administrador. Es posible que las reglas de seguridad de la base de datos no estén configuradas correctamente.";
             break;
          default:
            errorMessage = `Error al registrar: ${error.message} (Código: ${error.code})`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Image
            src="https://www.rribaceta.com.ar/equipamiento-comercial/img/logo-17237281228.jpg"
            alt="Ibaceta Logo"
            width={200}
            height={53}
            className="mx-auto"
            priority
          />
          <CardTitle className="text-2xl pt-4">Crear una Cuenta</CardTitle>
          <CardDescription>
            Complete sus datos para registrarse en el sistema.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salón</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su salón de trabajo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salonNames.map((salon) => (
                          <SelectItem key={salon} value={salon}>
                            {salon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="vendedor@example.com"
                        {...field}
                        type="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        {...field}
                        type="password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Crear Cuenta"}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
