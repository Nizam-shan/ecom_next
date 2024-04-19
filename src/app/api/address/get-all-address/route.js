import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "You are not loged in",
      });
    }
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const getAllAddresses = await Address.find({ userID: id });
      if (getAllAddresses) {
        return NextResponse.json({
          success: true,
          data: getAllAddresses,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to fetch Address",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User Not Authenticated!...",
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
