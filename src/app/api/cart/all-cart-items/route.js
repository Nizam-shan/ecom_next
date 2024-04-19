import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Cart from "@/models/cart";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Please login",
        });
      }

      const extractAllCartItem = await Cart.find({ userID: id }).populate(
        "productID"
      );

      if (extractAllCartItem) {
        return NextResponse.json({
          success: true,
          data: extractAllCartItem,
        });
      } else {
        return NextResponse.json({
          success: false,
          status: 204,
          message: "No cart items found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User is not Authorized ",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
