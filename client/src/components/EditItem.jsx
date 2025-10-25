import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setShopData } from "../Redux/owner.slice";
import { triggerItemsRefresh } from "../Redux/user.slice";
import { ImSpinner2 } from "react-icons/im";
   
const EditItem = () => {
  const { itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    "snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/item/get-item/${itemId}`,
          {
            withCredentials: true,
          }
        );
        const item = res.data.item;
        console.log("Fetched item:", item);
        setCurrentItem(item);
        setName(item.name || "");
        setPrice(item.price || "");
        setCategory(item.category || "");
        setFoodType(item.foodType || "veg");
        setFrontendImage(item.image || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", foodType);
      formData.append("category", category);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );

      const updatedItem = result.data;
      dispatch(setShopData(updatedItem.shop || {}));
      
      // Trigger refresh for user dashboard
      dispatch(triggerItemsRefresh());
      
      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fff0ec] to-white p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="w-[25px] h-[25px] text-[#ff4d2d]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#ff4d2d33] shadow-lg rounded-xl p-8 max-w-lg w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Edit Food Item
        </h2>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
          />
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Type</label>
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
          >
            <option value="veg">veg</option>
            <option value="non-veg">non-veg</option>
          </select>
        </div>

      <button
  type="submit"
  className="w-full flex items-center justify-center gap-2 bg-[#ff4d2d] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#e64528] transition-colors"
  disabled={loading}
>
  {loading ? (
    <ImSpinner2 className="animate-spin w-5 h-5" />
  ) : (
    <FaPlus />
  )}
  {loading ? "Saving..." : "Update Item"}
</button>

      </form>
    </div>
  );
};

export default EditItem;