import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shopModel.js";
import Item from "../models/itemModel.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found. Please create a shop first." });
    }

    let image;
    try {
      image = await uploadOnCloudinary(req.file.path);
    } catch (uploadError) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: uploadError.message });
    }

    if (!image) {
      return res
        .status(500)
        .json({ message: "Image upload failed - no URL returned" });
    }

    const item = await Item.create({
      name,
      category,
      image,
      price,
      foodType,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save({ validateModifiedOnly: true });

    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });

    return res.status(201).json({
      message: "Item added successfully",
      shop: shop,
    });
  } catch (error) {
    return res.status(500).json({ message: `add item error ${error.message}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    const { itemId } = req.params;

    const updateData = { name, category, foodType, price };

    if (req.file && req.file.path) {
      try {
        updateData.image = await uploadOnCloudinary(req.file.path);
      } catch (uploadError) {
        return res
          .status(500)
          .json({ message: "Image upload failed", error: uploadError.message });
      }
    }

    // Find and update the item
    const item = await Item.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Populate shop data on the item before returning
    await item.populate("shop");
    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
    return res.status(200).json({ item, shop });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `edit item error ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(500).json({ message: `get item error ${error.message}` });
  }
};

export const deleteItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Delete the item
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    // Find owner's shop
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Remove item reference from shop.items
    shop.items = shop.items.filter(i => i.toString() !== item._id.toString());

    // Save shop and populate items
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } }, // newest first
    });

    // Return both deleted item and updated shop
    return res.status(201).json({
      shop,
      item,
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete item error: ${error.message}` });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    // Find shops in the city
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops.length) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    // Extract shop IDs
    const shopIds = shops.map((shop) => shop._id);

    // Find items in these shops
    const items = await Item.find({ shop: { $in: shopIds } });

    if (!items.length) {
      return res
        .status(404)
        .json({ message: "No items found in shops of this city" });
    }

    // Standardized JSON response
    return res.status(200).json({
      success: true,
      shopCount: shops.length,
      itemCount: items.length,
      items,
    });
  } catch (error) {
    console.error("Error fetching items by city:", error);
    return res.status(500).json({
      message: "Server error while fetching items by city",
      error: error.message,
    });
  }
};
