"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { getAllOrderForUser } from "@/services/allOrders";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Orders() {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
  } = useContext(GlobalContext);

  async function exatractAllOrders() {
    setPageLevelLoader(true);
    const res = await getAllOrderForUser(user?.id);
    if (res?.success) {
      setPageLevelLoader(false);
      setAllOrdersForUser(res?.data);
      toast.success(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) return exatractAllOrders();
  }, [user]);

  console.log("ordr", allOrdersForUser);

  if (pageLevelLoader) {
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
  }
  return (
    <section className="text-black h-screen bg-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
          <div className="">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {allOrdersForUser && allOrdersForUser.length ? (
                  <ul className="flex flex-col gap-4">
                    {allOrdersForUser?.map((item) => (
                      <li
                        key={item?._id}
                        className="bg-white shadow p-5 flex flex-col space-y-3 py-6 text-left"
                      >
                        <div className="flex ">
                          <h1 className="font-bold text-lg mb-3 flex-1">
                            #order :{item?._id}
                          </h1>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900 ">
                              Total paid amount
                            </p>
                            <p className="mr-3 text-2xl font-semibold text-gray-900 ">
                              ${item?.totalPrice}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ">
                          {item?.orderItems.map((orderItem, index) => (
                            <div key={index} className="shrink-0 ">
                              <img
                                className="h-24 w-24 max-w-full rounded-lg object-cover"
                                src={
                                  orderItem &&
                                  orderItem?.product &&
                                  orderItem?.product?.imageUrl
                                }
                                alt="order item"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-5">
                          <button
                            type="button"
                            className=" text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide"
                          >
                            {item?.isProcessing
                              ? "Order is  processing"
                              : "Order is delivered"}
                          </button>

                          <button
                            type="button"
                            className=" text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide"
                          >
                            View order details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}
