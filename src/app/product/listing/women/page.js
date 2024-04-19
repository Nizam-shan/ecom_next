import CommanListing from "@/components/CommanListing";
import { productByCategory } from "@/services/admin/products";

export default async function WomenProducts() {
  const Product = await productByCategory("women");

  return <CommanListing data={Product && Product.data} />;
}
