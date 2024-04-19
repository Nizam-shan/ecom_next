import connectDb from "@/db";
import User from "@/models/user";
import { hash } from "bcrypt";
import Joi from "joi";
import { NextResponse } from "next/server";

const Schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  role: Joi.string().required(),
  password: Joi.string().required().min(6),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDb();

  const { email, name, role, password } = await req.json();

  // validate the schema

  const { error } = Schema.validate({ email, name, password, role });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    // check whether exist
    const isUserAlreadyExist = await User.findOne({ email });

    if (isUserAlreadyExist) {
      return NextResponse.json({
        success: false,
        message: "User already exist",
      });
    } else {
      // should hash the password

      const hashPassword = await hash(password, 12);
      const newlyCreatedUser = await User.create({
        name,
        role,
        email,
        password: hashPassword,
      });
      if (newlyCreatedUser) {
        return NextResponse.json({
          success: true,
          message: "Account Created SuccessFully",
        });
      }
    }
  } catch (error) {
    console.log("Error in user registration", error);
    return NextResponse.json({
      success: false,
      message: "Error in registration",
    });
  }
}
