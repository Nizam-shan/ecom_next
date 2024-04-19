import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID not found please login in...",
      });
    }
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const deleteAddress = await Address.findByIdAndDelete(id);
      if (deleteAddress) {
        return NextResponse.json({
          success: true,
          message: "Address deleted successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Some error occured please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User Not Authenticated please try agaib",
      });
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
