import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import TableFooter from "@/components/tables/TableFooter";
import TableDeleteItem from "@/components/tables/TableDeleteItem";
import { FetchProductsResponse } from "@/types/api";
import { deleteProduct } from "@/actions/products";
import { humanizeDateTime } from "@/utils/date";

const ProductTable: React.FC<FetchProductsResponse> = ({
  products,
  metadata,
}) => {
  return (
    <div className="flex flex-col mt-6 gap-8">
      <div className="grid w-full max-w-lg items-center gap-1.5">
        <LocalSearchbar
          route="/products"
          placeholder="Search for products..."
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Product Code</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  priority
                  alt={product.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  width="64"
                  src="/assets/images/placeholder.svg"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="font-medium">{product.code}</TableCell>
              <TableCell>{humanizeDateTime(product.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Link href={`/products/${product.id}/edit`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <TableDeleteItem
                      id={product.id}
                      onDelete={deleteProduct}
                      message="Product deleted successfully."
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </TableDeleteItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {Object.keys(metadata).length > 0 && <TableFooter metadata={metadata} />}
    </div>
  );
};

export default ProductTable;
