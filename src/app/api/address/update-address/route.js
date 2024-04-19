import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectDb();

    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const data = await req.json();
      const { _id, fullName, address, city, postalCode, country } = data;
      const UpdateAddress = await Address.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
        { new: true }
      );
      if (UpdateAddress) {
        return NextResponse.json({
          success: true,
          message: "Address updated successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update Address!.please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User Not authencticated please try again",
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
