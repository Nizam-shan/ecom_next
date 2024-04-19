import connectDb from "@/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({
        success: false,
        status: 409,
        message: "Product id not found..",
      });
    }

    const getData = await Product.find({ _id: productId });
    if (getData && getData.length) {
      return NextResponse.json({
        success: true,
        data: getData[0],
      });
    } else {
      console.log("err");
      return NextResponse.json({
        success: false,
        status: 404,
        message: "No data available",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
