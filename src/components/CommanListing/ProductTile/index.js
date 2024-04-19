"use client";

import { useRouter } from "next/navigation";

export default function ProductTile({ item }) {
  const router = useRouter();
  return (
    <>
      <div className="" onClick={() => router.push(`/product/${item._id}`)}>
        <div className="overflow-hidden aspect-w-1 aspect-h-1 h-52">
          <img
            src={item.imageUrl}
            alt="Product Name"
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
          />
        </div>
        {item?.onSale === "yes" ? (
          <div className="absolute top-0 rounded-full bg-black m-2 ">
            <p className="rounded-full p-1 text-[8px] font-bold uppercase text-white tracking-wide sm:px-3 sm:py-1">
              sale
            </p>
          </div>
        ) : null}
        <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
          <div className="flex  mb-2 text-black">
            <p
              className={`mr-3 text-sm font-semibold ${
                item?.onSale === "yes" ? "line-through" : null
              }`}
            >{`$ ${item?.price}`}</p>
            {item?.onSale === "yes" ? (
              <p className="mr-3 text-sm font-semibold text-red-700">{`$ ${(
                item?.price -
                item?.price * (item?.priceDrop / 100)
              ).toFixed(2)}`}</p>
            ) : null}
            {item?.onSale === "yes" ? (
              <p className="mr-3 text-sm font-semibold">{`-(${item?.priceDrop}%)off`}</p>
            ) : null}
          </div>
          <h3 className="mb-2 text-gray-400 text-sm">{item?.name}</h3>
        </div>
      </div>
    </>
  );
}
