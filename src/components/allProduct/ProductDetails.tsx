import {
  useCreateOrderMutation,
  useGetSingleProductQuery,
} from "@/redux/fetures/auth/authApi";
import { useParams } from "react-router-dom";
import {
  Loader2,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Truck,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/fetures/hooks";
import { addProduct, orderSelector } from "@/redux/fetures/card/shippingSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TProduct } from "./type";
import type { Swiper as SwiperType } from "swiper";

// Import next-share components
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  EmailIcon,
} from "next-share";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";

// Import Swiper styles
// @ts-expect-error css
import "swiper/css";
// @ts-expect-error navigation
import "swiper/css/navigation";
// @ts-expect-error thumbs
import "swiper/css/thumbs";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error ,isFetching } = useGetSingleProductQuery(id);
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("dhaka");
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    orderQuantity: 1,
  });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const dispatch = useAppDispatch();
  const cart = useAppSelector(orderSelector);

  const deliveryCharges = useMemo(() => ({
    dhaka: 100,
    outside: 120,
  }), []);

  const handleAddToCart = useCallback((product: TProduct) => {
    const existingProduct = cart.find((item) => item._id === product._id);

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
  }, [cart, dispatch]);

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };


  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !orderData.name ||
      !orderData.phone ||
      !orderData.address 
    ) {
      toast.error("দয়া করে সকল তথ্য পূরণ করুন");
      return;
    }

    // Calculate total amount
    const productTotal = (response?.data?.price || 0) * orderData.orderQuantity;
    const deliveryCharge =
      deliveryCharges[deliveryOption as keyof typeof deliveryCharges];
    const totalAmount = productTotal + deliveryCharge;

    // Prepare order data for API
    const orderPayload = {
      product: [
        {
          id: response?.data?._id,
          orderQuantity: orderData.orderQuantity,
        },
      ],
      customer: {
        name: orderData.name,
        phone: orderData.phone,
      },
      address: {
        address: orderData.address,
        district: orderData.district,
      },
      deliveryOption: deliveryOption,
      deliveryCharge: deliveryCharge,
      totalAmount: totalAmount,
    };

    console.log("Order Data:", orderPayload);

    const toastId = toast.loading("অর্ডার প্লেস করা হচ্ছে...");

    try {
      const res = await createOrder(orderPayload).unwrap();

      if (res?.success) {
        toast.success(res.message || "অর্ডার সফলভাবে প্লেস করা হয়েছে!", {
          id: toastId,
          duration: 3000,
        });
        setIsModalOpen(false);

        // Reset form
        setOrderData({
          name: "",
          phone: "",
          address: "",
          district: "",
          orderQuantity: 1,
        });
        setDeliveryOption("dhaka");

        // Optionally navigate to order confirmation page
        // navigate('/order-confirmation');
      } else {
        toast.error(res?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে", {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error: unknown) {
      console.error("Order Error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "কিছু সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      toast.error(errorMessage, {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: name === "orderQuantity" ? parseInt(value) : value,
    }));
  };

  // Quantity increment/decrement functions - memoized
  const incrementQuantity = useCallback(() => {
    if (
      response?.data &&
      orderData.orderQuantity < Math.min(response.data.stock, 10)
    ) {
      setOrderData((prev) => ({
        ...prev,
        orderQuantity: prev.orderQuantity + 1,
      }));
    }
  }, [response?.data, orderData.orderQuantity]);

  const decrementQuantity = useCallback(() => {
    if (orderData.orderQuantity > 1) {
      setOrderData((prev) => ({
        ...prev,
        orderQuantity: prev.orderQuantity - 1,
      }));
    }
  }, [orderData.orderQuantity]);

  // Calculate totals - memoized
  const productTotal = useMemo(
    () => (response?.data?.price || 0) * orderData.orderQuantity,
    [response?.data?.price, orderData.orderQuantity]
  );
  const deliveryCharge = useMemo(
    () => deliveryCharges[deliveryOption as keyof typeof deliveryCharges],
    [deliveryOption, deliveryCharges]
  );

  // Skeleton loader for faster perceived performance
  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-8">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-200 rounded-xl"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 flex-1 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            একটি সমস্যা হয়েছে
          </h2>
          <p className="text-gray-600 mb-6">
            পণ্যের তথ্য লোড করতে সমস্যা হচ্ছে
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-cyan-500 hover:text-cyan-600 transition cursor-pointer"
            >
              পিছনে
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition cursor-pointer"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            পণ্য খুঁজে পাওয়া যায়নি
          </h2>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition cursor-pointer"
          >
            হোমপেজে যান
          </button>
        </div>
      </div>
    );
  }

  const product = response.data;

  // Get photos array (support both photos and photo for backward compatibility)
  const photosArray = Array.isArray(product.photos)
    ? product.photos
    : Array.isArray(product.photo)
    ? product.photo
    : product.photo
    ? [product.photo]
    : [];

  // Get share data
  const productUrl = `${window.location.origin}/product/${product._id}`;
  const shareTitle = product.name;
  const shareDescription = `${product.name} - ${product.price}৳\n${product.description?.substring(0, 100) || ""}...`;

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success("পণ্যের লিঙ্ক কপি করা হয়েছে!", { duration: 2000 });
      setIsShareOpen(false);
    } catch {
      toast.error("লিঙ্ক কপি করতে সমস্যা হয়েছে", { duration: 2000 });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">পিছনে যান</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isFavorite
                      ? "bg-red-50 text-red-500"
                      : "bg-cyan-50 text-cyan-500 hover:bg-cyan-100"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`}
                  />
                </button>
                <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="p-3 rounded-full bg-cyan-50 text-cyan-500 hover:bg-cyan-100 transition cursor-pointer"
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-cyan-800 mb-3">
                        শেয়ার করুন
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <FacebookShareButton
                          url={productUrl}
                          quote={shareDescription}
                          hashtag={`#${product.name.replace(/\s+/g, "")}`}
                        >
                          <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <FacebookIcon size={32} round />
                            <span className="text-xs text-gray-700">Facebook</span>
                          </div>
                        </FacebookShareButton>

                        <WhatsappShareButton
                          url={productUrl}
                          title={shareDescription}
                          separator=":: "
                        >
                          <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <WhatsappIcon size={32} round />
                            <span className="text-xs text-gray-700">WhatsApp</span>
                          </div>
                        </WhatsappShareButton>

                        <TwitterShareButton
                          url={productUrl}
                          title={shareDescription}
                        >
                          <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <TwitterIcon size={32} round />
                            <span className="text-xs text-gray-700">Twitter</span>
                          </div>
                        </TwitterShareButton>

                        <TelegramShareButton
                          url={productUrl}
                          title={shareTitle}
                        >
                          <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <TelegramIcon size={32} round />
                            <span className="text-xs text-gray-700">Telegram</span>
                          </div>
                        </TelegramShareButton>

                        <EmailShareButton
                          url={productUrl}
                          subject={shareTitle}
                          body={shareDescription}
                        >
                          <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                            <EmailIcon size={32} round />
                            <span className="text-xs text-gray-700">Email</span>
                          </div>
                        </EmailShareButton>

                        <button
                          onClick={handleCopyLink}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs text-gray-700">Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-8">
              {/* Product Image Slider */}
              <div className="flex flex-col gap-4">
                {/* Main Image Slider */}
                <div className="relative rounded-xl sm:rounded-2xl w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden shadow-md">
                  {photosArray.length > 0 ? (
                    <>
                      <Swiper
                        spaceBetween={10}
                        navigation={photosArray.length > 1}
                        thumbs={{ swiper: thumbsSwiper }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        loop={photosArray.length > 1}
                        modules={[Navigation, Thumbs, Autoplay]}
                        className="main-swiper h-full [&_.swiper-button-next]:text-cyan-600 [&_.swiper-button-prev]:text-cyan-600 [&_.swiper-button-next]:bg-white/80 [&_.swiper-button-prev]:bg-white/80 [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-button-next]:w-10 [&_.swiper-button-prev]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-next]:shadow-lg [&_.swiper-button-prev]:shadow-lg hover:[&_.swiper-button-next]:bg-white hover:[&_.swiper-button-prev]:bg-white [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full"
                      >
                        {photosArray.map((photo: string, index: number) => (
                          <SwiperSlide key={index}>
                            <div className="w-full h-full overflow-hidden rounded-lg">
                              <img
                                src={photo}
                                alt={`${product.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {product.stock > 0 && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold z-10 shadow-lg backdrop-blur-sm">
                          ✅ ইন স্টক
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {photosArray.length > 1 && (
                  <div className="w-full">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[Navigation, Thumbs]}
                      className="thumbnail-swiper [&_.swiper-slide-thumb-active]:border-cyan-500 [&_.swiper-slide-thumb-active]:border-2"
                    >
                      {photosArray.map((photo: string, index: number) => (
                        <SwiperSlide key={index}>
                          <div className="aspect-square border-2 border-cyan-200 rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500 transition-colors">
                            <img
                              src={photo}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-5 sm:space-y-6 flex flex-col justify-center">
                {/* Category & Brand */}
                <div className="flex flex-wrap gap-2">
                  {product.category?.name && (
                    <span className="bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-cyan-200 shadow-sm">
                      {product.category.name}
                    </span>
                  )}
                  {product.brand && (
                    <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-blue-200 shadow-sm">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-cyan-600">
                      ৳{product.price}
                    </span>
                    <span className="text-sm text-gray-500">BDT</span>
                  </div>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-green-200 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {product.stock}টি available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-red-200 shadow-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      স্টক শেষ
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-cyan-200 shadow-sm">
                  <h3 className="font-bold text-cyan-800 mb-3 text-sm sm:text-base">
                    📋 পণ্যের বিবরণ
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-300/50 transition-all duration-300 flex items-center justify-center gap-2.5 hover:from-cyan-600 hover:to-cyan-700 active:scale-[0.98] ${
                      product.stock === 0 ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer"
                    }`}
                    disabled={product.stock === 0}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.stock > 0 ? "🛒 কার্টে যোগ করুন" : "স্টক শেষ"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full border-2 border-cyan-500 text-cyan-600 py-3.5 px-6 rounded-xl font-bold text-base hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
                    aria-label="Buy now"
                  >
                    <Zap className="h-5 w-5" />
                    ⚡ এখনই কিনুন
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Product Info */}
            <div className="border-t-2 border-gray-200 bg-gradient-to-br from-gray-50 to-cyan-50/30">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-6">
                  📊 পণ্যের বিবরন
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:border-cyan-300 transition-colors">
                      <span className="text-gray-600 font-medium">প্রোডাক্ট আইডি</span>
                      <span className="font-mono text-xs sm:text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                        {product._id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:border-cyan-300 transition-colors">
                      <span className="text-gray-600 font-medium">ব্র্যান্ড</span>
                      <span className="text-gray-900 font-semibold">
                        {product.brand || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:border-cyan-300 transition-colors">
                      <span className="text-gray-600 font-medium">ক্যাটাগরি</span>
                      <span className="text-gray-900 font-semibold">
                        {product.category?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:border-cyan-300 transition-colors">
                      <span className="text-gray-600 font-medium">যোগ করা হয়েছে</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(product.createdAt).toLocaleDateString(
                          "bn-BD"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shadcn Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <Truck className="h-6 w-6 text-cyan-600" />
              অর্ডার সম্পূর্ণ করুন
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              আপনার তথ্য এবং ডেলিভারি ঠিকানা প্রদান করুন
            </DialogDescription>
          </DialogHeader>

          {/* Product Summary */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-cyan-300 shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={photosArray.length > 0 ? photosArray[0] : typeof product.photo === "string" ? product.photo : ""}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    ৳{product.price} × {orderData.orderQuantity}
                  </p>
                  <p className="text-cyan-700 font-extrabold text-lg">৳{productTotal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-cyan-700 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                আপনার নাম
              </Label>
              <input
                type="text"
                id="name"
                name="name"
                value={orderData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                placeholder="আপনার পুরো নাম লিখুন"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-cyan-700 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                ফোন নম্বর
              </Label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={orderData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-cyan-700 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                সম্পূর্ণ ঠিকানা
              </Label>
              <input
                type="text"
                id="address"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="বাড়ি নং, রোড নং, এলাকা"
                required
              />
            </div>

            {/* District */}

          

            {/* Delivery Option */}
            <div className="space-y-3">
              <Label className="text-cyan-700 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                ডেলিভারি অপশন
              </Label>
              <RadioGroup
                value={deliveryOption}
                onValueChange={setDeliveryOption}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border border-cyan-200 rounded-lg p-3 hover:bg-cyan-50 transition">
                  <RadioGroupItem value="dhaka" id="dhaka" />
                  <Label htmlFor="dhaka" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>ঢাকা সিটিতে ডেলিভারি</span>
                      <span className="font-semibold text-cyan-600">
                        ৳{deliveryCharges.dhaka}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">৩-৪ কর্মদিবস</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-cyan-200 rounded-lg p-3 hover:bg-cyan-50 transition">
                  <RadioGroupItem value="outside" id="outside" />
                  <Label htmlFor="outside" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>ঢাকার বাইরে ডেলিভারি</span>
                      <span className="font-semibold text-cyan-600">
                        ৳{deliveryCharges.outside}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">৫-৭ কর্মদিবস</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label className="text-cyan-700">পরিমাণ</Label>
              <div className="flex items-center justify-between border border-cyan-200 rounded-lg p-1 bg-white">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  disabled={orderData.orderQuantity <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-cyan-600 hover:bg-cyan-50 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="flex-1 text-center">
                  <span className="text-lg font-semibold text-cyan-700">
                    {orderData.orderQuantity}
                  </span>
                  <span className="text-sm text-cyan-600 block">টি</span>
                </div>

                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={
                    orderData.orderQuantity >= Math.min(product.stock, 10)
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-cyan-600 hover:bg-cyan-50 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-cyan-600 text-center">
                সর্বোচ্চ {Math.min(product.stock, 10)}টি অর্ডার করা যাবে
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-5 space-y-2 border-2 border-cyan-200 shadow-sm">
              <h4 className="font-semibold text-cyan-800 text-sm">
                অর্ডার সারাংশ
              </h4>
              <div className="flex justify-between text-sm">
                <span>পণ্যের মূল্য:</span>
                <span>৳{productTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="border-t border-cyan-200 pt-2 flex justify-between font-semibold text-cyan-700">
                <span>মোট পরিশোধ:</span>
                <span>
                  ${productTotal} + ৳{deliveryCharge}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isCreatingOrder}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  অর্ডার প্লেস হচ্ছে...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  অর্ডার কনফার্ম করুন - ৳{productTotal} + ৳{deliveryCharge}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDetails;
