import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Cart from "@/models/cart";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDb();

    const isAuthuser = await AuthUser(req);
    if (isAuthuser) {
      const data = await req.json();

      const { user } = data;

      const saveNewOrder = await Order.create(data);
      if (saveNewOrder) {
        await Cart.deleteMany({ userID: user });
        return NextResponse.json({
          success: true,
          message: "Products are on the way...",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to create a order please try again...",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User is not a authorized please login in",
      });
    }
  } catch (error) {
    console.log("ERROR API", error);

    return NextResponse.json({
      success: false,
      message: "Some thing went wrong please try again...",
    });
  }
}
