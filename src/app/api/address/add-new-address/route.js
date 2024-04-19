import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Address from "@/models/address";
import Joi, { string } from "joi";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const AddNewAddress = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export async function POST(req) {
  try {
    await connectDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const data = await req.json();
      const { fullName, city, country, postalCode, address, userID } = data;
      const { error } = AddNewAddress.validate({
        fullName,
        city,
        country,
        postalCode,
        address,
        userID,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const newlyAddedAddress = await Address.create(data);

      if (newlyAddedAddress) {
        return NextResponse.json({
          success: true,
          message: "Address Added succesfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add address!.Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User is not authenticated",
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
