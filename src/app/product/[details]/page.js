import CommanDetails from "@/components/commanDetails";
import { productById } from "@/services/admin/products";

export default async function ProductById({ params }) {
  const productDataById = await productById(params?.details);

  return (
    <>
      <CommanDetails item={productDataById && productDataById.data} />
    </>
  );
}
