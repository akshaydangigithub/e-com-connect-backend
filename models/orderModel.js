import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status:{
    type:String,
    default:"Pending"
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
