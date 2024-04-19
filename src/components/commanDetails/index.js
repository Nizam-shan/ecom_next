"use client";

import { GlobalContext } from "@/context";
import { AddToCart } from "@/services/cart";
import { useContext } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentLevelLoader";
import Notification from "../Notification";

export default function CommanDetails({ item }) {
  const {
    setComponentLevelLoader,
    setShowCartModel,
    componentLevelLoader,
    user,
  } = useContext(GlobalContext);

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: "" });
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
    console.log(res);
  }
  return (
    <>
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-6">
        <div className=" container mx-auto px-4">
          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-center">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt="product name"
                      className="h-full w-full max-w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0 ">
                  <div className="flex flex-row items-start lg:flex-col">
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center"
                    >
                      <img
                        src={item.imageUrl}
                        alt="product name"
                        className="h-full w-full  object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center"
                    >
                      <img
                        src={item.imageUrl}
                        alt="product name"
                        className="h-full w-full  object-cover"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <h1 className="text-2xl font-bold text-gray-900 ">{item.name}</h1>
              <div className="mt-10 flex flex-col items-center justify-between border-t space-y-4 border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1
                    className={`text-3xl font-bold text-black  ${
                      item?.onSale === "yes" ? "line-through" : null
                    }`}
                  >
                    ${item && item.price}
                  </h1>
                  {item?.onSale === "yes" ? (
                    <h1 className="mr-3 text-sm font-semibold text-red-700">{`$ ${(
                      item?.price -
                      item?.price * (item?.priceDrop / 100)
                    ).toFixed(2)}`}</h1>
                  ) : null}
                  {item?.onSale === "yes" ? (
                    <h1 className="mr-3 text-sm font-semibold text-black">{`-(${item?.priceDrop}%)off`}</h1>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mt-1.5 bg-black inline-block px-5 py-3 text-xs font-medium tracking-wide uppercase text-white"
                  onClick={() => handleAddToCart(item)}
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={"Adding..."}
                      color={"white"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    "Add To Cart"
                  )}
                </button>
              </div>
              <ul className="mt-8 space-y-2">
                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  {item && item.deliveryInfo}
                </li>

                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  {`Cancel anytime`}
                </li>
              </ul>
              <div className="lg:col-span-3 ">
                <div className="border-b border-gray-400 ">
                  <nav className="flex gap-4 ">
                    <a
                      className="border-b-2 border-gray-900 py-4 text-sm text-gray-900 font-medium"
                      href="#"
                    >
                      Description
                    </a>
                  </nav>
                </div>
                <div className="mt-8 flow-root sm:mt-12  text-black">
                  {item && item.description}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notification />
      </section>
    </>
  );
}
