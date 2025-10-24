import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../Redux/owner.slice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopData } = useSelector((state) => state.owner);
  const { city, state, address } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shopData) {
      setName(shopData.name || "");
      setAddress(shopData.address || address);
      setCity(shopData.city || city);
      setState(shopData.state || state);
      setFrontendImage(shopData.image || null);
    } else {
      setAddress(address);
      setCity(city);
      setState(state);
    }
  }, [shopData, address, city, state]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopData && !backendImage) {
      alert("Please upload a shop image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", Address);
      formData.append("city", City);
      formData.append("state", State);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );

      dispatch(setShopData(res.data));
      setLoading(false);

      // Auto navigate back after save
      navigate(-1);
    } catch (err) {
      console.error("Shop save error:", err);
      alert(err.response?.data?.message || "Error saving shop");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-sm p-4 rounded-lg shadow-lg bg-white">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-100 p-3 rounded-full mb-3">
            <div className="text-red-600 text-3xl">🍴</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {shopData ? "Edit Shop" : "Add Shop"}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Shop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shop Image {!shopData && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              onChange={handleImage}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="Shop"
                  className="mt-2 w-full h-48 rounded-lg border object-cover"
                />
              </div>
            )}
          </div>

          {/* City & State */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={City}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={State}
                onChange={(e) => setState(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              loading ? "cursor-not-allowed" : "hover:bg-orange-700"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2 animate-spin">
                <svg
                  className="h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : shopData ? (
              "Update Shop"
            ) : (
              "Create Shop"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
