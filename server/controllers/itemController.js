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
    const itemId = req.params.itemId;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.items = shop.items.filter(
      (i) => i._id.toString() !== item._id.toString()
    );

    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Delete item error: ${error.message}` });
  }
};

