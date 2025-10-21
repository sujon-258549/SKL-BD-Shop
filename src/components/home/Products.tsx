import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";

export default function Products() {
  const products = [
    {
      _id: 1,
      name: "চিয়া সিডস কম্বো / Chia Seeds Combo",
      price: 1050,
      minPrice: 990,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Seeds",
      desc: "High-quality Chia seeds combo, rich in Omega-3 and fiber, perfect for healthy diets.",
    },
    {
      _id: 2,
      name: "হলুদ পাউডার / Turmeric Powder",
      price: 550,
      minPrice: 450,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Spices",
      desc: "Organic turmeric powder, ideal for cooking and traditional remedies.",
    },
    {
      _id: 3,
      name: "মধু / Honey",
      price: 850,
      minPrice: 650,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Honey & Sweeteners",
      desc: "Pure and natural honey, perfect for sweetening drinks and desserts.",
    },
    {
      _id: 4,
      name: "কালো জিরা / Black Cumin Seeds",
      price: 450,
      minPrice: 350,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Spices",
      desc: "Premium black cumin seeds, essential for flavoring curries and dishes.",
    },
    {
      _id: 5,
      name: "আদা পাউডার / Ginger Powder",
      price: 380,
      minPrice: 280,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Spices",
      desc: "Fine ginger powder, perfect for teas, cooking, and baking.",
    },
    {
      _id: 6,
      name: "লবঙ্গ / Cloves",
      price: 620,
      minPrice: 520,
      image:
        "https://amzadfood.com/wp-content/uploads/2025/07/Buter-Borfi-1kg-400x400.webp",
      desh: "Bangladesh",
      quantity: 1,
      category: "Spices",
      desc: "High-quality cloves, ideal for cooking, baking, and spice blends.",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    return filtered;
  }, [products, selectedCategory, search, sortOrder]);

  return (
    <main className="max-w-6xl mx-auto lg:px-3 my-10">
      <div className="mx-5 md:mx-10 lg:mx-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-slate-900 mb-6 text-center">
          আমাদের পণ্য / Our Products
        </h1>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between flex-wrap mb-6 gap-4">
          {/* Search */}
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

          {/* Sort */}
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
