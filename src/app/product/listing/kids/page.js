import CommanListing from "@/components/CommanListing";
import { productByCategory } from "@/services/admin/products";

export default async function KidsProducts() {
  const product = await productByCategory("kids");

  return <CommanListing data={product && product.data} />;
}
