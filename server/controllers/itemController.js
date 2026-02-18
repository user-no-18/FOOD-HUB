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

    
    const item = await Item.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true } 
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    
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

    
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

  
    shop.items = shop.items.filter((i) => i.toString() !== item._id.toString());

    
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } }, 
    });

    return res.status(201).json({
      shop,
      item,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Delete item error: ${error.message}` });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops.length) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    
    const shopIds = shops.map((shop) => shop._id);

   
    const items = await Item.find({ shop: { $in: shopIds } });

    if (!items.length) {
      return res
        .status(404)
        .json({ message: "No items found in shops of this city" });
    }

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

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "No shops found " });
    }
    return res.status(200).json({ shop, items: shop.items });
  } catch (error) {
      return res.status(500).json({
      message: "Server error while fetching items by shop",
      error: error.message,
    });
  }
};


export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;

   
    if (!query || !city) {
      return res.status(400).json({
        success: false,
        message: "query and city are required",
      });
    }


    const trimmedQuery = query.trim();
    const trimmedCity = city.trim();

    
    const shops = await Shop.find({
      city: { $regex: `^${trimmedCity}$`, $options: "i" },
    }).select("_id");

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shops found in this city",
      });
    }

    const shopIds = shops.map((shop) => shop._id);

    
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: trimmedQuery, $options: "i" } },
        { category: { $regex: trimmedQuery, $options: "i" } },
      ],
    }).populate("shop", "name image");

 
    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while searching items",
      error: error.message,
    });
  }
};
export const rateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { stars } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res
        .status(400)
        .json({ message: "Stars must be between 1 and 5" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const existingRatingIndex = item.ratings.users.findIndex(
      (r) => r.userId.toString() === req.userId
    );

    if (existingRatingIndex !== -1) {
      const oldStars = item.ratings.users[existingRatingIndex].stars;
      item.ratings.users[existingRatingIndex].stars = stars;

      const totalStars = item.ratings.average * item.ratings.count;
      const newTotalStars = totalStars - oldStars + stars;
      item.ratings.average = newTotalStars / item.ratings.count;
    } else {
      item.ratings.users.push({
        userId: req.userId,
        stars: stars,
      });

      const totalStars = item.ratings.average * item.ratings.count;
      const newTotalStars = totalStars + stars;
      item.ratings.count += 1;
      item.ratings.average = newTotalStars / item.ratings.count;
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message:
        existingRatingIndex !== -1
          ? "Rating updated successfully"
          : "Rating submitted successfully",
      item: item,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `rate item error: ${error.message}` });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const userRating = item.ratings.users.find(
      (r) => r.userId.toString() === req.userId
    );

    if (!userRating) {
      return res.status(200).json({ success: true, rating: null });
    }

    return res.status(200).json({
      success: true,
      rating: { stars: userRating.stars },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get user rating error: ${error.message}` });
  }
};