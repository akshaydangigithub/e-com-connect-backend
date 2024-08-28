import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    default: "Admin",
  },
  orders: [
    {
      product: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      ],
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
