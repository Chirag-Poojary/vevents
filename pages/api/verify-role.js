import { connectToDB } from "@/utils/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body;

  try {
    await connectToDB();
    const user = await User.findOne({ email, role });
    if (user) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
