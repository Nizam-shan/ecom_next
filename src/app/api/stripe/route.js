/* Integration of stripe payment gateway into our project */

import AuthUser from "@/middleware/Authuser";
import { NextResponse } from "next/server";
//  create a account in stripe https://dashboard.stripe.com/test/apikeys went test mode and api key copied the api key and pasted bellow
// also imported stripe from stripe (npm package)
const stripe = require("stripe")(
  "sk_test_51OdAggSCETGDxSQeZ3TCeHqvoN2pgMZHeMFYSzX4rWl4vRFH5QpasHHGp2W9z1W7z8XCqll0Ol3UHtwOODElidfy002cPBwkNF"
);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();

      // create a stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: "http://localhost:3000/checkout" + "?status=success",
        cancel_url: "http://localhost:3000/checkout" + "?status=cancel",
      });

      // returning the id which is recieved from session
      return NextResponse.json({
        success: true,
        id: session.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "You should be authorized person to delete the product",
      });
    }
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went please try again later!...",
    });
  }
}
