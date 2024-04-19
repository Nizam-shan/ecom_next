"use client";

import { Fragment, useContext, useEffect } from "react";
import CommonModel from "../comman";
import { GlobalContext } from "@/context";
import { DeleteFromCart, GetAllCartItems } from "@/services/cart";
import ComponentLevelLoader from "../Loader/componentLevelLoader";
import { toast } from "react-toastify";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function CartModel() {
  const {
    showCartModel,
    setShowCartModel,
    user,
    cartItems,
    setCartItems,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);
  const router = useRouter();

  async function extractAllCartItem() {
    const res = await GetAllCartItems(user?.id);
    if (res.success) {
      setCartItems(res?.data);
      localStorage.setItem("CartItems", JSON.stringify(res?.data));
    }
  }
  useEffect(() => {
    extractAllCartItem();
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
  return (
    <>
      <CommonModel
        showButton={true}
        show={showCartModel}
        setShow={setShowCartModel}
        mainContent={
          cartItems && cartItems.length ? (
            <ul role="listing" className="my-6 divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6 ">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item?.productID?.imageUrl}
                      alt="cart item"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a>{item?.productID?.name}</a>
                        </h3>
                      </div>
                      <p className=" mt-1 text-sm text-gray-600">
                        ${item?.productID?.price}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <button
                        className="font-medium text-yellow-600 sm:order-2"
                        type="button"
                        onClick={() => handleRemoveItem(item?._id)}
                      >
                        {componentLevelLoader &&
                        componentLevelLoader.loading &&
                        componentLevelLoader.id === item?._id ? (
                          <ComponentLevelLoader
                            text={"Removing"}
                            color={"black"}
                            loading={
                              componentLevelLoader &&
                              componentLevelLoader.loading
                            }
                          />
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null
        }
        buttonComponent={
          <Fragment>
            <button
              type="button"
              className="text-white mt-1.5 w-full inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
              onClick={() => {
                router.push("/cart"), setShowCartModel(false);
              }}
            >
              Go to cart
            </button>
            <button
              disabled={cartItems?.length === 0}
              type="button"
              className="text-white mt-1.5 w-full inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide  disabled:opacity-50"
              onClick={() => {
                router.push("/checkout"), setShowCartModel(false);
              }}
            >
              Checkout
            </button>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
              <button className="font-medium text-gray" type="button">
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          </Fragment>
        }
      />
    </>
  );
}
