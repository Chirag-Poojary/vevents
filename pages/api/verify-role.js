import { connectToDB } from "@/utils/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ success: true, role: user.role });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
