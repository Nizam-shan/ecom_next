import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role === "admin") {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({
          success: false,
          message: "Product Id not found",
        });
      const deleteProduct = await Product.findByIdAndDelete(id);
      if (deleteProduct) {
        return NextResponse.json({
          success: true,
          message: "Product deleted successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to delete product",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You should be authorized person to delete the product",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
