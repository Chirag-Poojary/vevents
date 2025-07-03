import { connectToDB } from "@/utils/dbConnect";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body; // ✅ Make sure 'role' is included in request

  try {
    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== role) {
      return res.status(403).json({ success: false, message: "Role mismatch" });
    }

    return res.status(200).json({ success: true, role: user.role });
  } catch (err) {
    console.error("Error verifying role:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
