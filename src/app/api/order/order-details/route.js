import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const isAuthUSer = await AuthUser(req);

    if (isAuthUSer) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({
          success: false,
          message: " ID not found",
        });
      }

      // here populate method is used were in order schema there is orderItems in that there is product which a refrence of actual Products Schema populate fetches the actual Product document and replace the reference in orderItems
      const getAllOrder = await Order.findById(id).populate(
        "orderItems.product"
      );
      if (getAllOrder) {
        return NextResponse.json({
          success: true,
          data: getAllOrder,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No data found || failed to get ",
        });
      }
    } else {
      NextResponse.json({
        success: false,
        message: "Not a authorized user please login",
      });
    }
  } catch (error) {
    console.log("ERROR API", error);
    return NextResponse.json({
      success: false,
      message: "Some error occured please try again",
    });
  }
}
