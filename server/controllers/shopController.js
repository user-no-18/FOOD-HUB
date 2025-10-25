import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Create or Edit Shop
export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;

    // Upload new image if provided
    if (req.file && req.file.path) {
      console.log("Uploading file:", req.file.path);
      image = await uploadOnCloudinary(req.file.path);
      console.log("Image uploaded:", image);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // Creating new shop - image is required
      if (!image) {
        return res
          .status(400)
          .json({ message: "Image is required for new shop" });
      }

      shop = await Shop.create({
        name,
        city,
        state,
        address,
        owner: req.userId,
        image,
      });
    } else {
      // Updating existing shop
      const updateData = { name, city, state, address };

      // Only update image if new one uploaded
      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    // Always fetch full shop data with image
    shop = await Shop.findById(shop._id).populate("owner").populate("items");

    return res.status(201).json(shop);
  } catch (error) {
    console.error("Create/Edit Shop Error:", error);
    return res
      .status(500)
      .json({ message: `Shop operation failed: ${error.message}` });
  }
};

// Get current user's shop
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate({ path: "items", options: { sort: { createdAt: -1 } } })
      .populate("owner");

    if (!shop) return res.status(200).json(null);

    return res.status(200).json(shop);
  } catch (error) {
    console.error("Get My Shop Error:", error);
    return res
      .status(500)
      .json({ message: `Get shop failed: ${error.message}` });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: "City is required" });

    const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, "i") } }).populate("items");

    if (!shops.length) return res.status(404).json({ message: "No shops found" });

    res.status(200).json({ success: true, count: shops.length, shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};