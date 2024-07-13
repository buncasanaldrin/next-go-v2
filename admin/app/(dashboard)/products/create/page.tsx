import ProductForm from "@/components/forms/ProductForm";

const ProductCreatePage: React.FC = async () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <ProductForm />
    </div>
  );
};

export default ProductCreatePage;
