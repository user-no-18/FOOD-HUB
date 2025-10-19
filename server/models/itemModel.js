import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    category: {
      type: String,
      enum: [
        "snacks",
        "beverages",
        "meals",
        "desserts",
        "breakfast",
        "lunch",
        "dinner",
        "street food",
        "fast food",
        "healthy",
        "vegan",
        "vegetarian",
        "non-vegetarian",
        "seafood",
        "bakery",
        "ice cream",
        "salads",
        "soups",
        "combo meals",
        "kids menu",
        "seasonal specials",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    foodtype: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
  },
  { timestamps: true }
);


const item = mongoose.model("Item", itemSchema);
export default item;