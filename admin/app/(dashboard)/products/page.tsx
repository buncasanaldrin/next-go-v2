import Link from "next/link";

import ProductTable from "@/components/tables/ProductTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchParamsProps } from "@/types/page";
import { fetchProducts } from "@/actions/products";

const ProductPage: React.FC<SearchParamsProps> = async ({ searchParams }) => {
  const products = await fetchProducts({
    name: searchParams?.q ?? "",
    page: searchParams.page ? +searchParams.page : 1,
  });

  if (!products.data || products.error) {
    return (
      <div className="text-center text-lg font-semibold text-muted-foreground">
        Error loading products page
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their details.
                </CardDescription>
              </div>
              <Link href="/products/create">
                <Button className="ml-auto">Create Product</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Separator />
            <ProductTable
              products={products?.data?.products}
              metadata={products?.data?.metadata}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductPage;
