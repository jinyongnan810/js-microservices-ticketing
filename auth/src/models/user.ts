import mongoose from "mongoose";
import { Password } from "../services/password";

// Describe attributes needed to create a user
interface UserAttrs {
  email: String;
  password: String;
}
// Describe a user model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
// Describe a user document
interface UserDoc extends mongoose.Document {
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.hash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({ email: "abc", password: "abc" });
export { User };
