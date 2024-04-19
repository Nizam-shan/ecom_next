import connectDb from "@/db";
import User from "@/models/user";
import Joi from "joi";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

export const dynamic = "force-dynamic";

const Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export async function POST(req) {
  await connectDb();

  const { email, password } = await req.json();
  const { error } = Schema.validate({ email, password });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }
  try {
    // check user
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: "Entered user not found",
      });
    }

    // check password

    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Password dosent match",
      });
    }

    // if real user should create a token
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser?.email,
        role: checkUser?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        email: checkUser.email,
        name: checkUser.name,
        role: checkUser.role,
        id: checkUser._id,
      },
    };

    return NextResponse.json({
      success: true,
      message: "User loged in successfully",
      finalData,
    });
  } catch (error) {
    console.log("Error in user login", error);
    return NextResponse.json({
      success: false,
      message: "Error in login",
    });
  }
}
