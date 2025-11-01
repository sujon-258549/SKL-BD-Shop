import { useState } from "react";
import {
  addProduct,
  decrementProductQuantity,
  incrementProductQuantity,
  orderSelector,
} from "@/redux/fetures/card/shippingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/fetures/hooks";
import { FaBagShopping } from "react-icons/fa6";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

const ProductCard = ({ product }: { product: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(orderSelector);

  const incrementQuantity = (product: any) =>
    dispatch(incrementProductQuantity(product));
  const decrementQuantity = (product: any) =>
    dispatch(decrementProductQuantity(product));

  const handleAddToCart = (product: any) => {
    const existingProduct = cart.find((item: any) => item._id === product._id);

    if (existingProduct) {
      dispatch(incrementProductQuantity(product));
      toast.success("পণ্যের পরিমাণ বৃদ্ধি করা হয়েছে!", { duration: 2000 });
    } else {
      dispatch(addProduct(product));
      toast.success("পণ্যটি সফলভাবে কার্টে যোগ করা হয়েছে।", {
        duration: 2000,
      });
    }
  };

  const productInCart = cart.find((p: any) => p._id === product._id);
  const isInCart = !!productInCart;

  return (
    <div
      style={{ boxShadow: "1px 1px 8px" }}
      className="group relative bg-white overflow-hidden transition duration-300 hover:shadow-md "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-36 md:h-44 bg-gray-100 overflow-hidden">
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
          <div className="w-full justify-center flex items-center gap-2 pb-2">
            {/* ➖ Decrement Button */}
            {isInCart && (
              <button
                onClick={() => decrementQuantity(product)}
                className="w-9 h-9 cursor-pointer flex items-center justify-center border border-gray-300 bg-white rounded-sm hover:bg-gray-100 transition-all duration-200 shadow-sm"
              >
                <Minus className="h-4 w-4 text-cyan-800" />
              </button>
            )}

            {/* 🔢 Quantity Display */}
            {isInCart && (
              <button className="w-9 h-9 flex cursor-pointer items-center justify-center text-white bg-primary rounded-sm font-semibold text-sm shadow-sm">
                {productInCart?.orderQuantity}
              </button>
            )}

            {/* 🛍️ Add to Cart / Always Visible */}
            <button
              onClick={() => handleAddToCart(product)}
              className={`w-9 h-9 flex items-center cursor-pointer justify-center rounded-sm shadow-md text-white transition-all duration-300 ${
                isInCart
                  ? "bg-cyan-700 hover:bg-cyan-800"
                  : "bg-primary hover:bg-cyan-700"
              }`}
            >
              <FaBagShopping size={16} />
            </button>

            {/* ➕ Increment Button */}
            {isInCart && (
              <button
                onClick={() => incrementQuantity(product)}
                className="w-9 h-9 flex items-center cursor-pointer justify-center border border-gray-300 bg-white rounded-sm hover:bg-gray-100 transition-all duration-200 shadow-sm"
              >
                <Plus className="h-4 w-4 text-cyan-800" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Link to={`/product/${product?._id}`}>
        <button className="px-4 sm:px-6 py-2 cursor-pointer w-full bg-primary text-white font-semibold hover:bg-cyan-700 transition-all duration-300 text-[14px] md:text-sm">
          বিস্তারিত
        </button>
      </Link>

      <div className="p-3 flex flex-col justify-between h-[60px] md:h-[100px] text-center">
        <h3 className="text-[12px] md:text-sm font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[12px] md:text-xl font-bold text-primary">
          {product.price} ৳
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
