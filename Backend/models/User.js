import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  name: String,
  identifier: String // could be a username or anonymous id
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  friends: [FriendSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
