"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpsertProductSchema } from "@/utils/schemas";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "@/components/ui/use-toast";
import { FetchProductByIdResponse } from "@/types/api";

type Props = {
  data?: FetchProductByIdResponse;
};

type ProductSchema = z.infer<typeof UpsertProductSchema>;

const ProductForm: React.FC<Props> = ({ data }) => {
  const isEditing = !!data;
  const router = useRouter();
  const form = useForm<ProductSchema>({
    resolver: zodResolver(UpsertProductSchema),
    values: {
      name: data?.product?.name ?? "",
      code: data?.product?.code ?? "",
    },
  });

  const upsertProduct = async (product: ProductSchema) => {
    if (isEditing) {
      return await updateProduct({ ...product, id: data.product.id });
    }

    return await createProduct(product);
  };

  const onSubmit = async (product: ProductSchema) => {
    try {
      const { error } = await upsertProduct(product);
      if (error) {
        return toast({ variant: "destructive", description: error });
      }

      toast({
        description: `Successfully ${isEditing ? "updated" : "created"} the product`,
        duration: 2000,
      });

      router.push("/products");
    } catch (e) {
      toast({
        variant: "destructive",
        description: "An unexpected error occured. Please try again later.",
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>
                {`${isEditing ? "Update" : "Create"}`} Product
              </CardTitle>
              <CardDescription>
                Fill in the form below to{" "}
                {`${isEditing ? "update the product" : "create a new product"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name<span className="text-primary-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the product"
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Code<span className="text-primary-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the code of the product"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-end w-full gap-5">
                <Link href="/products">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {`${isEditing ? "Update" : "Create"}`} Product
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
