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
import type { TProduct } from "../allProduct/type";

const ProductCard = ({ product, index }: { product: TProduct; index?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(orderSelector);

  const incrementQuantity = (product: TProduct) =>
    dispatch(incrementProductQuantity(product));
  const decrementQuantity = (product: TProduct) =>
    dispatch(decrementProductQuantity(product));

  const handleAddToCart = (product: TProduct) => {
    const existingProduct = cart.find((item) => item._id === product._id);

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

  const productInCart = cart.find((p) => p._id === product._id);
  const isInCart = !!productInCart;

  return (
    <div
      className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-gray-200 hover:border-cyan-400 hover:-translate-y-1 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Index Badge */}
        {typeof index === "number" && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
            #{index}
          </div>
        )}
        <img
          src={
            Array.isArray(product.photos) && product.photos.length > 0
              ? product.photos[0]
              : Array.isArray(product.photo) && product.photo.length > 0
              ? product.photo[0]
              : typeof product.photo === "string"
              ? product.photo
              : ""
          }
          alt={product.name || "Product image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 ${
            isHovered ? "bg-black/10" : ""
          } flex mt-7 flex-col items-center justify-end transition-all duration-500`}
        >
          <div className="w-full justify-center flex items-center gap-2 pb-2">
            {/* ➖ Decrement Button - Only show if quantity > 1 */}
            {isInCart && productInCart && productInCart.orderQuantity > 1 && (
              <button
                onClick={() => decrementQuantity(product)}
                aria-label="Decrease quantity"
                className="w-9 h-9 cursor-pointer flex items-center justify-center border-2 border-gray-300 bg-white rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                <Minus className="h-4 w-4 text-cyan-800" />
              </button>
            )}

            {/* 🔢 Quantity Display - Only show if quantity > 0 */}
            {isInCart && productInCart && productInCart.orderQuantity > 0 && (
              <div className="w-9 h-9 flex items-center justify-center text-white bg-primary rounded-md font-semibold text-sm shadow-sm border-2 border-white">
                {productInCart.orderQuantity}
              </div>
            )}

            {/* 🛍️ Add to Cart / Always Visible */}
            <button
              onClick={() => handleAddToCart(product)}
              aria-label={`Add ${product.name} to cart`}
              className={`w-9 h-9 flex items-center cursor-pointer justify-center rounded-md shadow-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                isInCart
                  ? "bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900"
                  : "bg-primary hover:bg-cyan-700 active:bg-cyan-800"
              }`}
            >
              <FaBagShopping size={16} />
            </button>

            {/* ➕ Increment Button - Only show if quantity > 0 */}
            {isInCart && productInCart && productInCart.orderQuantity > 0 && (
              <button
                onClick={() => incrementQuantity(product)}
                aria-label="Increase quantity"
                className="w-9 h-9 flex items-center cursor-pointer justify-center border-2 border-gray-300 bg-white rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                <Plus className="h-4 w-4 text-cyan-800" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col justify-between min-h-[90px] sm:min-h-[100px] gap-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            ৳{product.price}
          </p>
          <Link to={`/product/${product?._id}`} className="block">
            <button 
              className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs sm:text-sm font-bold hover:from-cyan-600 hover:to-cyan-700 active:scale-95 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              aria-label={`View details for ${product.name}`}
            >
              বিস্তারিত
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
