import { useState } from "react";
import { addProduct, orderSelector } from "@/redux/fetures/card/shippingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/fetures/hooks";
import { FaBagShopping } from "react-icons/fa6";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: any }) => {
  console.log(product)
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const dispatch = useAppDispatch();
  const cart = useAppSelector(orderSelector);

  const handleAddToCart = (product: any) => {
    const existingProduct = cart.find((item: any) => item._id === product._id);

    if (existingProduct) {
      toast.success(
        "পণ্যটি ইতিমধ্যেই কার্টে যোগ করা হয়েছে। কার্ট পেজে পরিমাণ বৃদ্ধি করা হয়েছে।",
        { duration: 2000 }
      );
    } else {
      dispatch(addProduct(product));
      toast.success("পণ্যটি সফলভাবে কার্টে যোগ করা হয়েছে।", {
        duration: 2000,
      });
    }
  };

  const handleOrderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", orderData);
    toast.success(`${product.name} এর অর্ডার সম্পন্ন হয়েছে।`);
    setOrderData({ name: "", phone: "", address: "", quantity: 1 });
    setShowModal(false);
  };

  return (
    <>
      {/* Product Card (UNCHANGED) */}
      <div
        style={{ boxShadow: "1px 1px 8px" }}
        className="group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product photo */}
        <div className="relative h-32 sm:h-52 bg-gray-100 overflow-hidden">
          <img
            src={product.photo}
            alt={product.name}
            className="w-full h-full mb-6 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 ${
              isHovered ? "bg-black/10" : ""
            } flex mt-7 flex-col items-center justify-end transition-all duration-500`}
          >
            <div className="w-full justify-start relative group">
              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="p-2 ml-3 bg-primary cursor-pointer text-white mb-1 shadow-sm border border-gray-300 hover:bg-primary hover:text-white text-primary transition-all duration-300 flex items-center"
              >
                <FaBagShopping size={18} />
              </button>
              
              {/* Details Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-4 sm:px-6 py-2 w-full bg-primary text-white font-semibold hover:bg-cyan-700 transition-all duration-300 text-xs sm:text-sm"
              >
                বিস্তারিত
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col justify-between h-[70px] md:h-[100px] text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-bold text-primary">
            {product.price} ৳
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold text-lg"
            >
              ×
            </button>

            {/* Product Details */}
            <img
              src={product?.photo}
              alt={product?.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.desc}</p>
            <p className="text-green-600 font-bold mb-2">{product.price} ৳</p>

            {/* Order Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-2">
              <input
                type="text"
                name="name"
                placeholder="নাম"
                value={orderData.name}
                onChange={handleOrderChange}
                required
                className="w-full p-2 text-sm border-b border-gray-300 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                name="phone"
                placeholder="ফোন / মোবাইল"
                value={orderData.phone}
                onChange={handleOrderChange}
                required
                className="w-full p-2 text-sm border-b border-gray-300 focus:outline-none focus:border-primary"
              />
              <textarea
                name="address"
                placeholder="ঠিকানা"
                value={orderData.address}
                onChange={handleOrderChange}
                required
                className="w-full p-2 text-sm border-b border-gray-300 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="text-sm">পরিমাণ:</label>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  max={10}
                  value={orderData.quantity}
                  onChange={handleOrderChange}
                  className="w-16 p-1 text-sm border border-gray-300 rounded text-center"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 text-sm font-semibold hover:bg-cyan-700 transition-all duration-300"
              >
                অর্ডার করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
