import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
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
      const deleteCartItem = await Cart.findByIdAndDelete(id);
      if (deleteCartItem) {
        return NextResponse.json({
          success: true,
          message: "cart item deleted successfully",
        });
      } else {
        return NextResponse.json({
          success: false,

          message: "Failed to delete cart item",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Not authorized user ",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
