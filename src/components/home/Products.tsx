import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useGetAllProductQuery } from "@/redux/fetures/auth/authApi"; // RTK Query

export default function Products() {
  // ---------- State ----------
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ---------- Fetch Products ----------
  const { data: productsResponse, isLoading , isFetching } = useGetAllProductQuery("");
  const products = useMemo(() => productsResponse?.data || [], [productsResponse?.data]);

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

  if (isLoading || isFetching)
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border-2 cursor-pointer font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-600 shadow-md"
                  : "bg-white text-cyan-600 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50"
              }`}
              aria-label={`Filter by ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-base sm:text-lg">
                No products found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
