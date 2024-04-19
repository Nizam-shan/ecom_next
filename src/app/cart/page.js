"use client";

import CommanCart from "@/components/CommanCart";
import { GlobalContext } from "@/context";
import { DeleteFromCart, GetAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Cart() {
  const {
    user,
    setCartItems,
    cartItems,
    setComponentLevelLoader,
    componentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllCartItem() {
    setPageLevelLoader(true);
    const res = await GetAllCartItems(user?.id);
    if (res.success) {
      setCartItems(res?.data);
      setPageLevelLoader(false);
      localStorage.setItem("CartItems", JSON.stringify(res?.data));
    }
  }
  useEffect(() => {
    if (user !== null) extractAllCartItem();
  }, [user]);

  async function handleRemoveItem(getCartItem) {
    setComponentLevelLoader({ loading: true, id: getCartItem });
    const res = await DeleteFromCart(getCartItem);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllCartItem();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  if (pageLevelLoader)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color="black"
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );

  return (
    <CommanCart
      cartItems={cartItems}
      handleRemoveItem={handleRemoveItem}
      componentLevelLoader={componentLevelLoader}
    />
  );
}
