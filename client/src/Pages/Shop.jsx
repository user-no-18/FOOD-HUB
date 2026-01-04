import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { serverUrl } from "../App";

const Shop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShop = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );

      setShop(res.data.shop);
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  if (loading) return <p>Loading...</p>;
  if (!shop) return <p>Shop not found</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-orange-500 px-4 py-6 sm:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex items-center gap-1 text-white text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Shop Info */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-20 h-20 rounded-xl object-cover border-2 border-white"
          />

          <div className="text-white">
            <h1 className="text-xl font-semibold">{shop.name}</h1>
            <p className="text-sm opacity-90">{shop.city}</p>
            <p className="text-xs opacity-80">{shop.address}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-6 sm:px-8">
        <h2 className="text-lg font-semibold text-orange-500 mb-4">
          Items
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div
              key={item._id}
              className="border rounded-xl p-3 hover:shadow-sm transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-xs text-orange-500 font-semibold">
                ₹{item.price}
              </p>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-sm text-gray-400 mt-6">
            No items available
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
