import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useGetAllProductQuery } from "@/redux/fetures/auth/authApi"; // RTK Query

export default function Products() {
  // ---------- State ----------
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ---------- Fetch Products ----------
  const { data: productsResponse, isLoading } = useGetAllProductQuery("");
  const products = productsResponse?.data || [];

  // ---------- Categories ----------
  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category?.name || p.category))],
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

  // Search Filter (case-insensitive)
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand?.toLowerCase() || "").includes(search.toLowerCase())
    );
  }

  // Sort by price
  filtered.sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return filtered;
}, [products, selectedCategory, search, sortOrder]);


  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading products...</p>;

  return (
    <main className="max-w-6xl mx-auto lg:px-3 my-10">
      <div className="mx-5 md:mx-10 lg:mx-0">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between flex-wrap mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-10 py-2 min-w-[200px] md:min-w-[300px] rounded-md w-full text-sm sm:text-base md:text-base border-primary focus:outline-none transition"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border px-3 py-2 rounded-md text-sm sm:text-base md:text-base border-primary focus:outline-none transition w-full md:w-auto"
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm sm:text-base md:text-base">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-sm border border-primary font-medium transition-colors duration-300 text-sm sm:text-base ${
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
