import CommanListing from "@/components/CommanListing";
import { productByCategory } from "@/services/admin/products";

export default async function Menproducts() {
  const mensProduct = await productByCategory("men");

  return <CommanListing data={mensProduct && mensProduct.data} />;
}
