"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { SignInSchema } from "@/utils/schemas";
import { loginUser } from "@/actions/users";
import { toast } from "@/components/ui/use-toast";

const SigninForm: React.FC = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onSubmit = async (user: z.infer<typeof SignInSchema>) => {
    try {
      const { error } = await loginUser(user);
      if (error) {
        return toast({ variant: "destructive", description: error });
      }

      toast({ description: "Successfully logged in", duration: 2000 });

      setIsLoggedIn(true);
    } catch (e) {
      toast({
        variant: "destructive",
        description: "An unexpected error occured. Please try again later.",
      });
    }
  };

  const { isSubmitting } = form.formState;

  // Use useEffect for reliable redirection (router.push sometimes fails in try-catch)
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                  placeholder="Enter your email address"
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
          Login
        </Button>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className={`underline ${isSubmitting ? "disabled" : ""}`}
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SigninForm;
