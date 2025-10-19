import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shopModel.js";
import Item from "../models/itemModel.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    const shop = await Shop.findOne({ owner: req.userId });
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "image is required" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      image,
      price,
      shop: shop._id,
    });
    shop.items.push(item._id);

    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });
    await item.populate("shop");
    return res.status(201).json({
      shop,
      item,
    });
  } catch (error) {
    return res.status(500).json({ message: `add item error ${error}` });
  }
};


export const editItem=async (req,res) => {
    try {
        const {name,category,foodType,price}=req.body
        const {itemId}=req.params
       
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }
         const item=await Item.findByIdAndUpdate(itemId,{
            name,category,foodType,price,image
         },{new:true})
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
        await item.populate("shop")
return res.status(200).json(item)

    } catch (error) {
        return res.status(500).json({ message: `edit item error ${error}` });
    }
}