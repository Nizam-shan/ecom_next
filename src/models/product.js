import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    sizes: Array,
    priceDrop: Number,
    category: String,
    deliveryInfo: String,
    onSale: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
