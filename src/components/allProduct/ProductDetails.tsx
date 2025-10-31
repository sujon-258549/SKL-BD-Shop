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
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { districts } from "../shipping/district";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetSingleProductQuery(id);
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("dhaka");
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    orderQuantity: 1,
  });

  const dispatch = useAppDispatch();
  const cart = useAppSelector(orderSelector);

  const deliveryCharges = {
    dhaka: 100,
    outside: 120,
  };

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

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !orderData.name ||
      !orderData.phone ||
      !orderData.address ||
      !orderData.district
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
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(
        error?.data?.message ||
          "কিছু সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
        {
          id: toastId,
          duration: 3000,
        }
      );
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

  // Quantity increment/decrement functions
  const incrementQuantity = () => {
    if (
      response?.data &&
      orderData.orderQuantity < Math.min(response.data.stock, 10)
    ) {
      setOrderData((prev) => ({
        ...prev,
        orderQuantity: prev.orderQuantity + 1,
      }));
    }
  };

  const decrementQuantity = () => {
    if (orderData.orderQuantity > 1) {
      setOrderData((prev) => ({
        ...prev,
        orderQuantity: prev.orderQuantity - 1,
      }));
    }
  };

  // Calculate totals
  const productTotal = (response?.data?.price || 0) * orderData.orderQuantity;
  const deliveryCharge =
    deliveryCharges[deliveryOption as keyof typeof deliveryCharges];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
          <p className="text-gray-600 text-lg font-medium">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
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
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-cyan-500 hover:text-cyan-600 transition"
            >
              পিছনে
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
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
            className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            হোমপেজে যান
          </button>
        </div>
      </div>
    );
  }

  const product = response.data;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">পিছনে যান</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full transition ${
                    isFavorite
                      ? "bg-red-50 text-red-500"
                      : "bg-cyan-50 text-cyan-500 hover:bg-cyan-100"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`}
                  />
                </button>
                <button className="p-3 rounded-full bg-cyan-50 text-cyan-500 hover:bg-cyan-100 transition">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl shadow-xl border border-cyan-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="relative bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl p-6 w-full max-w-md aspect-square">
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {product.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ইন স্টক
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Category & Brand */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category?.name}
                  </span>
                  <span className="bg-blue-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.brand}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-bold text-cyan-600">
                    {product.price}
                  </span>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {product.stock}টি available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      স্টক শেষ
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                  <h3 className="font-semibold text-cyan-800 mb-2">
                    পণ্যের বিবরণ
                  </h3>
                  <p className="text-cyan-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full bg-cyan-500 text-sm cursor-pointer text-white py-3 px-8 rounded-xl font-semibold hover:bg-cyan-600 transition duration-200 shadow-lg shadow-cyan-200 flex items-center justify-center gap-3 ${
                      product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.stock > 0 ? "কার্টে যোগ করুন" : "স্টক শেষ"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full cursor-pointer border-2 text-sm border-cyan-500 text-cyan-600 py-2.5 px-8 rounded-xl font-semibold hover:bg-cyan-50 transition duration-200 flex items-center justify-center gap-3"
                  >
                    <Zap className="h-5 w-5" />
                    এখনই কিনুন
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Product Info */}
            <div className="border-t border-cyan-100 bg-cyan-50/50">
              <div className="p-6">
                <h2 className="text-xl font-bold text-cyan-800 mb-4">
                  পণ্যের বিবরন
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-cyan-100">
                      <span className="text-cyan-700">প্রোডাক্ট আইডি</span>
                      <span className="font-mono text-sm text-cyan-900">
                        {product._id}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-cyan-100">
                      <span className="text-cyan-700">ব্র্যান্ড</span>
                      <span className="text-cyan-900 font-medium">
                        {product.brand}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-cyan-100">
                      <span className="text-cyan-700">ক্যাটাগরি</span>
                      <span className="text-cyan-900 font-medium">
                        {product.category?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-cyan-100">
                      <span className="text-cyan-700">যোগ করা হয়েছে</span>
                      <span className="text-cyan-900">
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cyan-800 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              অর্ডার সম্পূর্ণ করুন
            </DialogTitle>
            <DialogDescription className="text-cyan-600">
              আপনার তথ্য এবং ডেলিভারি ঠিকানা প্রদান করুন
            </DialogDescription>
          </DialogHeader>

          {/* Product Summary */}
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <div className="flex items-center gap-4">
              <img
                src={product.photo}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-800 text-sm">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-cyan-600 text-sm">
                    {product.price} × {orderData.orderQuantity}
                  </p>
                  <p className="text-cyan-700 font-bold">{productTotal}</p>
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
                className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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

            <p className="text-lg font-medium mb-2 text-cyan-900">
              Select District
            </p>

            <Select
              value={orderData.district}
              onValueChange={(value) =>
                setOrderData((prev) => ({ ...prev, district: value }))
              }
            >
              <SelectTrigger className="w-full border border-cyan-900 rounded-md bg-cyan-50 hover:bg-cyan-100 focus:ring-2 focus:ring-cyan-400">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>

              <SelectContent className="bg-cyan-50 border border-cyan-400 rounded-md">
                {districts.map((d) => (
                  <SelectItem
                    key={d}
                    value={d}
                    className="hover:bg-cyan-200 focus:bg-cyan-300"
                  >
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-cyan-600 hover:bg-cyan-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-cyan-600 hover:bg-cyan-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-cyan-600 text-center">
                সর্বোচ্চ {Math.min(product.stock, 10)}টি অর্ডার করা যাবে
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-cyan-50 rounded-lg p-4 space-y-2 border border-cyan-200">
              <h4 className="font-semibold text-cyan-800 text-sm">
                অর্ডার সারাংশ
              </h4>
              <div className="flex justify-between text-sm">
                <span>পণ্যের মূল্য:</span>
                <span>${productTotal}</span>
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
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 font-semibold disabled:opacity-50"
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  অর্ডার প্লেস হচ্ছে...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  অর্ডার কনফার্ম করুন - ${productTotal} + ৳{deliveryCharge}
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
