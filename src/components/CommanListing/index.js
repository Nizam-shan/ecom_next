"use client";

import { useRouter } from "next/navigation";
import ProductButton from "./ProductButton";
import ProductTile from "./ProductTile";
import { useEffect } from "react";
import Notification from "../Notification";

const dummyData = [
  {
    _id: "6574596976e55bc916224e44",
    name: "reds kid",
    description:
      "A shoe is an item of footwear intended to protect and comfort the huma…",
    price: "500",

    priceDrop: 0,
    category: "kids",
    deliveryInfo: "free",
    onSale: "yes",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/next-js-project-nizam.appspot.com/o/ecommerce%2FScreenshot%20from%202023-12-06%2010-39-48.png-1702123822612-honba3rhde?alt=media&token=cb06cf22-dfb8-4b01-9f12-ded0ce66999f",
    sizes: [
      {
        id: "s",
        label: "s",
      },
    ],
  },
  {
    _id: "6574596976e55bc916724e44",
    name: "reds kid",
    description:
      "A shoe is an item of footwear intended to protect and comfort the huma…",
    price: "500",

    priceDrop: 0,
    category: "kids",
    deliveryInfo: "free",
    onSale: "yes",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/next-js-project-nizam.appspot.com/o/ecommerce%2FScreenshot%20from%202023-12-06%2010-39-48.png-1702123822612-honba3rhde?alt=media&token=cb06cf22-dfb8-4b01-9f12-ded0ce66999f",
    sizes: [
      {
        id: "s",
        label: "s",
      },
    ],
  },
  {
    _id: "6574596976e55bc916224e49",
    name: "reds kid",
    description:
      "A shoe is an item of footwear intended to protect and comfort the huma…",
    price: "500",

    priceDrop: 0,
    category: "kids",
    deliveryInfo: "free",
    onSale: "yes",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/next-js-project-nizam.appspot.com/o/ecommerce%2FScreenshot%20from%202023-12-06%2010-39-48.png-1702123822612-honba3rhde?alt=media&token=cb06cf22-dfb8-4b01-9f12-ded0ce66999f",
    sizes: [
      {
        id: "s",
        label: "s",
      },
    ],
  },
  {
    _id: "6574596976e55bc916224e45",
    name: "reds kid",
    description:
      "A shoe is an item of footwear intended to protect and comfort the huma…",
    price: "500",

    priceDrop: 0,
    category: "kids",
    deliveryInfo: "free",
    onSale: "yes",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/next-js-project-nizam.appspot.com/o/ecommerce%2FScreenshot%20from%202023-12-06%2010-39-48.png-1702123822612-honba3rhde?alt=media&token=cb06cf22-dfb8-4b01-9f12-ded0ce66999f",
    sizes: [
      {
        id: "s",
        label: "s",
      },
    ],
  },
];

export default function CommanListing({ data }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
          {data && data.length
            ? data.map((item) => (
                <article
                  className="relative flex flex-col overflow-hidden border cursor-pointer"
                  key={item._id}
                >
                  <ProductTile item={item} />
                  <ProductButton item={item} />
                </article>
              ))
            : null}
        </div>
      </div>
      <Notification />
    </section>
  );
}
