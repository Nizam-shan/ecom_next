"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { getAllAddress } from "@/services/address";
import { CreateOrder } from "@/services/allOrders";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkOutFormData,
    setCheckOutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function getAllAddresses() {
    const res = await getAllAddress(user?.id);
    if (res.success) {
      setAddresses(res?.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  function handleSelectedAddress(getaddress) {
    if (getaddress._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckOutFormData({
        ...checkOutFormData,
        shippingAddress: {},
      });
      return;
    }
    setSelectedAddress(getaddress._id);
    setCheckOutFormData({
      ...checkOutFormData,
      shippingAddress: {
        ...checkOutFormData.shippingAddress,
        fullName: getaddress.fullName,
        city: getaddress.city,
        country: getaddress.country,
        postalCode: getaddress.postalCode,
        address: getaddress.address,
      },
    });
  }

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));

      if (
        isStripe &&
        params.get("status") === "success" &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getCheckOutFormData = JSON.parse(
          localStorage.getItem("checkOutFormData")
        );

        const createFinalOrderData = {
          user: user?.id,
          shippingAddress: getCheckOutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod: "stripe",
          totalPrice: cartItems.reduce(
            (total, item) => item.productID.price + total,
            0
          ),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };
        const res = await CreateOrder(createFinalOrderData);
        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setIsOrderProcessing(false);
          setOrderSuccess(false);
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }

    createFinalOrder();
  }, [params.get("status"), cartItems]);

  // copied publishable key from stripe api key and imported loadStripe from stripe and passed that key into that

  const publishableKey =
    "pk_test_51OdAggSCETGDxSQeR6k8yueYzY9NTaGipc9yAymwxeGoDPFBsqtTbAKycro8Co9FXAAPPTmmb039aLTKlJdQgHJM00le9JLSV2";

  const stripePromise = loadStripe(publishableKey);

  async function handleStripPayment() {
    // passed that stripepromise to this function which will call when the function is trigerred
    const stripe = await stripePromise;
    // creating a line items to strip
    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: [item?.productID?.imageUrl],
          name: item?.productID?.name,
        },
        unit_amount: item?.productID?.price * 100,
      },
      quantity: 1,
    }));

    // called the api service which is creted in service folder
    const res = await callStripeSession(createLineItems);
    setIsOrderProcessing(true);
    localStorage.setItem("stripe", true);
    localStorage.setItem("checkOutFormData", JSON.stringify(checkOutFormData));
    // errror recieving from stripe if the error occured it will redricted to checkout page
    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    console.log("eror ", error);
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        router.push("/orders");
      }, [2000]);
    }
  }, [orderSuccess]);

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color="black"
          loading={isOrderProcessing}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200 ">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow ">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg text-black">
                  Your order is successfull you will be redricted to orders page
                  in 2 seconds
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="font-medium text-xl">Cart Summary</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5 text-black">
            {cartItems && cartItems.length ? (
              cartItems.map((items) => (
                <div
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={items._id}
                >
                  <img
                    src={items?.productID && items?.productID?.imageUrl}
                    alt="cart Item"
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-bold ">
                      {items?.productID && items?.productID?.name}
                    </span>
                    <span className="font-semibold">
                      {items?.productID && items?.productID?.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>Your Cart is empty</div>
            )}
          </div>
        </div>

        <div className=" mt-10 bg-gray-50 px-4 pt-8 lg:mt-0 text-black">
          <p className="text-xl font-medium">Shipping address Details</p>

          <p className="text-xl font-bold text-gray-400">
            Complete Your Order by seleceting Address below
          </p>
          <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6 ">
            {addresses && addresses.length ? (
              addresses.map((item) => (
                <div
                  className={`border p-6 ${
                    item?._id === selectedAddress ? "border-red-900 " : ""
                  }`}
                  key={item._id}
                  onClick={() => handleSelectedAddress(item)}
                >
                  <p>Name: {item?.fullName}</p>
                  <p>City:{item?.city}</p>
                  <p>Country:{item?.country}</p>
                  <p>Address:{item?.address}</p>
                  <p>postal code:{item?.postalCode}</p>
                  <button
                    type="button"
                    className="text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
                  >
                    {item?._id === selectedAddress
                      ? "Selected Address"
                      : " Select Address"}
                  </button>
                </div>
              ))
            ) : (
              <p>no address added</p>
            )}
          </div>
          <button
            type="button"
            className="text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
            onClick={() => router.push("/account")}
          >
            Add New Address
          </button>
          <div className="mt-6 border-t border-b py-2 ">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900"> Subtotal</p>
              <p className="text-lg font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item.productID.price + total,
                      0
                    )
                  : 0}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="text-lg font-bold text-gray-900">Free</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900"> Total</p>
              <p className="text-lg font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item.productID.price + total,
                      0
                    )
                  : 0}
              </p>
            </div>
            <div className="pb-10">
              <button
                disabled={
                  (cartItems && cartItems.length === 0) ||
                  Object.keys(checkOutFormData.shippingAddress).length === 0
                }
                type="button"
                className="disabled:opacity-50 text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide  w-full"
                onClick={handleStripPayment}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
        <Notification />
      </div>
    </div>
  );
}
