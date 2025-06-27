import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["principal", "hod", "committee", "accounts"], required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
