import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useGetAllProductQuery } from "@/redux/fetures/auth/authApi"; // RTK Query

export default function Products() {
  // ---------- State ----------
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ---------- Fetch Products ----------
  const { data: productsResponse, isLoading } = useGetAllProductQuery("");
  const products = productsResponse?.data || [];

  // ---------- Categories ----------
  const categories = useMemo(
    () => [
      "All",
      ...new Set(products.map((p) => p.category?.name || p.category)),
    ],
    [products]
  );

  // ---------- Filtered & Sorted Products ----------
  const filteredProducts = useMemo(() => {
    let filtered = [...products]; // <-- make a copy

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) =>
          (p.category?._id || p.category) === selectedCategory ||
          (p.category?.name || p.category) === selectedCategory
      );
    }




    return filtered;
  }, [products, selectedCategory,]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-cyan-300 border-t-cyan-600 rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-gray-500 font-medium text-center text-sm sm:text-base">
          Loading products...
        </p>
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto lg:px-3 my-10">
      <div className="mx-5 md:mx-10 lg:mx-0">
     
        

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm sm:text-base md:text-base">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-sm border cursor-pointer border-primary font-medium transition-colors duration-300 text-sm sm:text-base ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-blue-100 text-primary hover:bg-blue-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
              No products found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
