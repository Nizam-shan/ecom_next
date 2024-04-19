import connectDb from "@/db";
import Product from "@/models/product";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    // const user = "admin";
    // if (user === "admin") {
    const extractAllProduct = await Product.find({});

    if (extractAllProduct) {
      return NextResponse.json({
        success: true,
        data: extractAllProduct,
      });
    } else {
      console.log("err");
      return NextResponse.json({
        success: false,
        status: 404,
        message: "No data available",
      });
    }
    // } else {
    //   return NextResponse.json({
    //     success: false,
    //     message: "You are not authorized user!...",
    //   });
    // }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
