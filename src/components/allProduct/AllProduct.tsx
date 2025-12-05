import { useState, useEffect, useMemo, type FormEvent,  } from "react";
import { Link } from "react-router-dom";
import { RxCross2, RxChevronLeft, RxChevronRight } from "react-icons/rx";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";

import { useGetAllProductQuery } from "@/redux/fetures/auth/authApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LoadingPage from "../common/loding/LoadingPage";
import AddToCart from "../ui/AddTocart";

const AllProduct = () => {
  // State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Build query params with useMemo (best practice to avoid rebuilding on every render)
  const queryParams = useMemo(() => {
    const params: { name: string; value: string | number }[] = [
      { name: "limit", value: 4 },
      { name: "page", value: currentPage },
    ];
    if (search) {
      params.push({ name: "search", value: search });
    }
    return params;
  }, [currentPage, search]);

  // API call
  const { data: product, isLoading , isFetching} = useGetAllProductQuery(queryParams);
  const products = useMemo(() => product?.data || [], [product?.data]);
  const totalPages = product?.meta?.totalPage || 1;

  // Track current photo index per product
  const [currentPhotoIndexes, setCurrentPhotoIndexes] = useState<Record<string, number>>({});

  // Reset photo indexes whenever products change
  useEffect(() => {
    if (products.length > 0) {
      const initialIndexes: Record<string, number> = {};
      products.forEach((p) => {
        const photosArray = Array.isArray(p.photos)
          ? p.photos
          : Array.isArray(p.photo)
          ? p.photo
          : p.photo
          ? [p.photo]
          : [];
        if (photosArray.length > 0) {
          initialIndexes[p._id] = 0;
        }
      });
      setCurrentPhotoIndexes(initialIndexes);
    }
  }, [products]);

  // Navigation for photos
  const nextPhoto = (productId: string, length: number) => {
    setCurrentPhotoIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % length,
    }));
  };

  const prevPhoto = (productId: string, length: number) => {
    setCurrentPhotoIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + length) % length,
    }));
  };

  // Search handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // reset to page 1 when searching
  };

  // Loading state
  if (isLoading || isFetching) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight">
            All Products
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Explore our products with interactive cards showcasing details, pricing, and availability.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 sm:mb-12">
          <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>

              <Input
                type="search"
                id="default-search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 sm:h-14 ps-12 pr-28 text-base rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              />

              <Button
                type="submit"
                className="absolute end-2 bottom-1.5 sm:bottom-2 text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all rounded-lg px-4 py-2 font-semibold"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {products.map((product) => {
              // Get photos array (support both photos and photo for backward compatibility)
              const photosArray = Array.isArray(product.photos)
                ? product.photos
                : Array.isArray(product.photo)
                ? product.photo
                : product.photo
                ? [product.photo]
                : [];

              const currentIndex = currentPhotoIndexes[product._id] || 0;
              const currentPhoto = photosArray[currentIndex] || "";

              return (
                <div
                  key={product._id}
                  className="relative bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 group overflow-hidden hover:border-cyan-400 hover:-translate-y-1"
                >
                  {/* Product image */}
                  <div className="relative h-64 overflow-hidden">
                    {photosArray.length > 0 ? (
                      <>
                        <img
                          src={currentPhoto}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Photo navigation */}
                        {photosArray.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                prevPhoto(product._id, photosArray.length);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                            >
                              <RxChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                nextPhoto(product._id, photosArray.length);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                            >
                              <RxChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Photo indicators */}
                        {photosArray.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {photosArray.map((_: string, index: number) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPhotoIndexes((prev) => ({
                                    ...prev,
                                    [product._id]: index,
                                  }));
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentIndex
                                    ? "bg-white w-6"
                                    : "bg-white/50 hover:bg-white/75"
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Photo index counter */}
                        {photosArray.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                            {currentIndex + 1} / {photosArray.length}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}

                    {/* Stock status */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-1.5 px-3 rounded-full text-xs shadow-lg backdrop-blur-sm">
                      {product.stockStatus ? (
                        <span className="text-xs sm:text-sm">✅ In Stock</span>
                      ) : (
                        <span className="text-xs sm:text-sm flex gap-1 items-center">
                          <RxCross2 /> Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Product status */}
                    <div
                      className={`absolute top-3 left-3 text-white font-semibold py-1.5 px-3 rounded-full text-xs shadow-md backdrop-blur-sm ${
                        product.status === "active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600"
                          : "bg-gradient-to-r from-gray-500 to-gray-600"
                      }`}
                    >
                      {product.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="p-5 sm:p-6">
                    <h2
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]"
                      title={product.name}
                    >
                      {product.name}
                    </h2>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600">
                        ৳{product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.category?.length > 0 ? (
                        product.category.slice(0, 2).map((cat: { _id: string; name: string }) => (
                          <span
                            key={cat._id}
                            className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">No categories</span>
                      )}
                    </div>

                    <div className="flex gap-2 justify-between items-center mt-6">
                      <Link to={`/product/${product._id}`} className="flex-1">
                        <Button
                          className="w-full cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="mr-2"
                          >
                            <path
                              d="M3 3h2l.4 2M7 13h10l3-8H6.4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Details
                        </Button>
                      </Link>

                      {/* AddToCart button */}
                      <div className="flex-shrink-0">
                        <AddToCart product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
