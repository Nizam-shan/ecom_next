import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectDb();

    const extractData = await req.json();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role === "admin") {
      const {
        _id,
        name,
        description,
        price,
        priceDrop,
        category,
        onSale,
        sizes,
        deliveryInfo,
      } = extractData;
      const updateProduct = await Product.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          name,
          description,
          price,
          priceDrop,
          category,
          onSale,
          sizes,
          deliveryInfo,
        },
        { new: true }
      );
      if (updateProduct) {
        return NextResponse.json({
          success: true,
          message: "Product updated successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update the product",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You should be authorized person to Update the product",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
