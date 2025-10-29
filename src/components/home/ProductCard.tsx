import { useState } from "react";
import { addProduct, orderSelector } from "@/redux/fetures/card/shippingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/fetures/hooks";
import { FaBagShopping } from "react-icons/fa6";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: any }) => {
  console.log(product);
  const [isHovered, setIsHovered] = useState(false);

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
              <Link to={`/product/${product?._id}`}>
                <button className="px-4 sm:px-6 py-2 w-full bg-primary text-white font-semibold hover:bg-cyan-700 transition-all duration-300 text-xs sm:text-sm">
                  বিস্তারিত
                </button>
              </Link>
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
    </>
  );
};

export default ProductCard;
