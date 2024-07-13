"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SignUpSchema } from "@/utils/schemas";
import { registerUser } from "@/actions/users";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SignupForm: React.FC = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (user: z.infer<typeof SignUpSchema>) => {
    try {
      const { error } = await registerUser(user);

      if (error) {
        return toast({ variant: "destructive", description: error });
      }

      toast({ description: "Account created successfully", duration: 2000 });
      router.push("/sign-in");
    } catch (e) {
      toast({
        variant: "destructive",
        description: "An unexpected error occured. Please try again later.",
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                First name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Last name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Email <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  {...field}
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
            <FormItem className="space-y-3.5">
              <FormLabel>
                Password <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Sign up
        </Button>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className={`underline ${isSubmitting ? "disabled" : ""}`}
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
