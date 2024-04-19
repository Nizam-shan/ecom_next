import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Cart from "@/models/cart";

import Joi from "joi";

import { NextResponse } from "next/server";

const AddTocart = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
});
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDb();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();

      const { productID, userID } = data;

      const { error } = AddTocart.validate({ userID, productID });
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const isCurrentCartItemAlreadyExsit = await Cart.find({
        productID: productID,
        userID: userID,
      });

      if (
        isCurrentCartItemAlreadyExsit &&
        isCurrentCartItemAlreadyExsit.length > 0
      ) {
        return NextResponse.json({
          success: false,
          message: "Product already present in cart",
        });
      }

      const saveToCart = await Cart.create(data);

      if (saveToCart) {
        return NextResponse.json({
          success: true,
          message: "Product added to cart",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add to the cart",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User is not a valid user",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again...",
    });
  }
}
