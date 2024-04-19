import CommanListing from "@/components/CommanListing";
import { getAllAdminProducts } from "@/services/admin/products";

export default async function AllProducts() {
  const getAllProducts = await getAllAdminProducts();
  return (
    <>
      <CommanListing data={getAllProducts && getAllProducts.data} />
    </>
  );
}
