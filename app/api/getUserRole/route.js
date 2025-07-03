// app/api/getUserRole/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/dbConnect";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectToDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role }, { status: 200 });
  } catch (err) {
    console.error("❌ getUserRole error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
