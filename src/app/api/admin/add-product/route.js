import connectDb from "@/db";
import AuthUser from "@/middleware/Authuser";
import Product from "@/models/product";
import { data } from "autoprefixer";
import Joi from "joi";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AddNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  sizes: Joi.array().required(),
  priceDrop: Joi.number().required(),
  category: Joi.string().required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().required(),
  imageUrl: Joi.string().required(),
});

export async function POST(req) {
  try {
    await connectDb();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser?.role === "admin") {
      const extraData = await req.json();
      const {
        name,
        description,
        price,
        onSale,
        deliveryInfo,
        priceDrop,
        sizes,
        imageUrl,
        category,
      } = extraData;
      const { error } = AddNewProductSchema.validate({
        name,
        description,
        price,
        onSale,
        deliveryInfo,
        priceDrop,
        sizes,
        imageUrl,
        category,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const newlyCreatedProduct = await Product.create(extraData);
      if (newlyCreatedProduct) {
        return NextResponse.json({
          success: true,
          message: "Product added successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add product",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authorized user!...",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Some error occured!..please try again ",
    });
  }
}
