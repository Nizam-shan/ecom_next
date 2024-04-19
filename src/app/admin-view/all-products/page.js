import CommanListing from "@/components/CommanListing";
import { getAllAdminProducts } from "@/services/admin/products";

export default async function AdminAllProducts() {
  const allAdminProducts = await getAllAdminProducts();

  return <CommanListing data={allAdminProducts && allAdminProducts?.data} />;
}
