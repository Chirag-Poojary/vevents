import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/dbConnect";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { email, role } = await req.json();
    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Role mismatch" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, role: user.role },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error verifying role:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
