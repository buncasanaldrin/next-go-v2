import { fetchProductById } from "@/actions/products";
import ProductForm from "@/components/forms/ProductForm";

type Props = {
  params: { id: string };
};

const ProductEditPage: React.FC<Props> = async ({ params }) => {
  const product = await fetchProductById(+params.id);

  if (product.error || !product.data) {
    return (
      <div className="text-center text-lg font-semibold text-muted-foreground">
        Error loading edit product page
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <ProductForm data={product?.data} />
    </div>
  );
};

export default ProductEditPage;
