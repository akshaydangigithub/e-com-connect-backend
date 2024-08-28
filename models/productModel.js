import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    images: [
      {
        type: Object,
        default: {
          fileId: "",
          url: "",
        },
      },
    ],

    name: String,
    price: Number,
    about: String,
    category: String,
    sku: String,
    tags: [
      {
        type: String,
      },
    ],
    description: String,
    weight: String,
    dimensions: String,
    size: String,
    colors: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
