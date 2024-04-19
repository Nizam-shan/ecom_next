"use client";

import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { deleteProduct } from "@/services/admin/products";
import { AddToCart } from "@/services/cart";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductButton({ item }) {
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");
  const {
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModel,
    setShowCartModel,
  } = useContext(GlobalContext);

  const router = useRouter();

  async function handleDelete(item) {
    setComponentLevelLoader({ loading: true, id: item._id });
    const res = await deleteProduct(item._id);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });

      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem?._id });
    const res = await AddToCart({ productID: getItem._id, userID: user.id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModel(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModel(true);
    }
  }
  return (
    <>
      <div className="">
        {isAdminView ? (
          <div>
            <button
              onClick={() => {
                setCurrentUpdatedProduct(item),
                  router.push("/admin-view/add-products");
              }}
              className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              Update
            </button>{" "}
            <button
              onClick={() => handleDelete(item)}
              className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              {componentLevelLoader &&
              componentLevelLoader.loading &&
              item._id === componentLevelLoader.id ? (
                <ComponentLevelLoader
                  text={"Deleting Product"}
                  color={"white"}
                  loading={componentLevelLoader && componentLevelLoader.loading}
                />
              ) : (
                "Delete"
              )}
            </button>{" "}
          </div>
        ) : (
          <div>
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              {componentLevelLoader &&
              componentLevelLoader.loading &&
              item._id === componentLevelLoader.id ? (
                <ComponentLevelLoader
                  text={"Adding to cart"}
                  color={"white"}
                  loading={componentLevelLoader && componentLevelLoader.loading}
                />
              ) : (
                "Add to cart"
              )}
            </button>
          </div>
        )}
      </div>
      <Notification />
    </>
  );
}
