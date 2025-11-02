import { useGetSingleOrderQuery } from "@/redux/fetures/auth/authApi";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Box,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: orderData, isLoading , isFetching} = useGetSingleOrderQuery(id);
  const order = orderData?.data;

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-cyan-700 font-medium text-sm sm:text-base">
            অর্ডার ডিটেইলস লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-cyan-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-2">
            অর্ডার পাওয়া যায়নি
          </h3>
          <Button
            onClick={() => navigate(-1)}
            className="bg-cyan-600 hover:bg-cyan-700 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            পিছনে যান
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      fullDate: date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
    };
  };

  const formattedDate = formatDateTime(order.createdAt);
  const updatedDate = formatDateTime(order.updatedAt);

  // Calculate total products and items
  const totalProducts = order.product?.length || 0;
  const totalItems = order.product?.reduce((total: number, item: any) => {
    return total + (item.orderQuantity || 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-cyan-600 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            পিছনে যান
          </Button>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-800 flex items-center gap-1 sm:gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            অর্ডার বিবরণ
          </h1>
        </div>

        {/* Order Summary Card */}
        <Card className="border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-1 sm:h-2"></div>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-cyan-800">
                অর্ডার # {order._id?.slice(-8).toUpperCase()}
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-4">
                <Badge
                  className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 ${
                    order.isAccepted
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}
                >
                  {order.isAccepted ? "গৃহীত" : "মুলতুবি"}
                </Badge>
                <div className="text-xs sm:text-sm text-cyan-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formattedDate.fullDate}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      order.deliveryStatus ? "text-green-600" : "text-cyan-600"
                    }`}
                  />
                  <span className="font-semibold text-cyan-800 text-sm sm:text-base">
                    ডেলিভারি স্ট্যাটাস
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {order.deliveryStatus ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  )}
                  <span
                    className={`text-sm sm:text-base ${
                      order.deliveryStatus
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    {order.deliveryStatus
                      ? "ডেলিভারি হয়েছে"
                      : "ডেলিভারিPending"}
                  </span>
                </div>
              </div>

              <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      order.paymentStatus ? "text-green-600" : "text-cyan-600"
                    }`}
                  />
                  <span className="font-semibold text-cyan-800 text-sm sm:text-base">
                    পেমেন্ট স্ট্যাটাস
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {order.paymentStatus ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  )}
                  <span
                    className={`text-sm sm:text-base ${
                      order.paymentStatus ? "text-green-700" : "text-orange-700"
                    }`}
                  >
                    {order.paymentStatus ? "পেড" : "অপেক্ষমান"}
                  </span>
                </div>
              </div>

              <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaBangladeshiTakaSign  className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-semibold text-cyan-800 text-sm sm:text-base">
                    মোট Amount
                  </span>
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 flex items-center gap-1">
                  <FaBangladeshiTakaSign  className="w-4 h-4 sm:w-5 sm:h-5" />
                  {order.totalAmount?.toFixed(2)}
                </div>
              </div>

              <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                  <span className="font-semibold text-cyan-800 text-sm sm:text-base">
                    পণ্য সংক্ষেপ
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-cyan-700">
                    {totalProducts} পণ্য
                  </div>
                  <div className="text-xs sm:text-sm text-cyan-600">
                    {totalItems} টি আইটেম
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Customer Details */}
              <Card className="border-cyan-200">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-cyan-800">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    গ্রাহকের তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-cyan-50 rounded-lg">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-cyan-600">নাম</p>
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">
                        {order.customer?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-cyan-50 rounded-lg">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-cyan-600">ফোন নম্বর</p>
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">
                        {order.customer?.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="border-cyan-200">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-cyan-800">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    ডেলিভারি ঠিকানা
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-cyan-50 rounded-lg">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-cyan-600">ঠিকানা</p>
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base mb-1 sm:mb-2">
                        {order.address?.address}
                      </p>
                      <p className="text-xs sm:text-sm text-cyan-600">জেলা</p>
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">
                        {order.address?.district || "উল্লেখ করা হয়নি"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products List */}
            <Card className="border-cyan-200 mt-4 sm:mt-6">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-cyan-800">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  অর্ডারকৃত পণ্য ({totalProducts} টি পণ্য - {totalItems} টি আইটেম)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {order.product?.map((item: any, index: number) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-cyan-50 rounded-lg border border-cyan-200 hover:bg-cyan-100 transition-colors"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-cyan-800 text-sm sm:text-base lg:text-lg">
                            {item.id?.name || "পণ্যের নাম উল্লেখ করা হয়নি"}
                          </h4>
                          <p className="text-xs sm:text-sm text-cyan-600 mb-1 sm:mb-2">
                            Product ID: {item.id?._id?.slice(-8)}
                          </p>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {item.id?.brand && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                ব্র্যান্ড: {item.id.brand}
                              </Badge>
                            )}
                            {item.id?.price && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                <FaBangladeshiTakaSign  className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                {item.id.price}
                              </Badge>
                            )}
                            {item.id?.stock !== undefined && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                স্টক: {item.id.stock}
                              </Badge>
                            )}
                          </div>
                          {item.id?.description && (
                            <p className="text-xs sm:text-sm text-cyan-700 mt-1 sm:mt-2">
                              {item.id.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                        <Badge className="bg-cyan-100 text-cyan-700 border-cyan-300 font-semibold px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base">
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {item.orderQuantity} pcs
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs sm:text-sm text-cyan-600">মূল্য</div>
                          <div className="font-bold text-cyan-800 text-sm sm:text-base flex items-center gap-1">
                            <FaBangladeshiTakaSign  className="w-3 h-3 sm:w-4 sm:h-4" />
                            {(item.id?.price * item.orderQuantity)?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="border-cyan-200 mt-4 sm:mt-6">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-cyan-800">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  অর্ডার টাইমলাইন
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">
                        অর্ডার তৈরি হয়েছে
                      </p>
                      <p className="text-xs sm:text-sm text-cyan-600">
                        {formattedDate.date} - {formattedDate.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        order.isAccepted ? "bg-green-500" : "bg-cyan-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">
                        অর্ডার গ্রহণ
                      </p>
                      <p className="text-xs sm:text-sm text-cyan-600">
                        {order.isAccepted ? "গৃহীত হয়েছে" : "মুলতুবি"}
                      </p>
                      {order.isAccepted && (
                        <p className="text-xs text-cyan-500">
                          আপডেট: {updatedDate.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        order.deliveryStatus ? "bg-green-500" : "bg-cyan-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">ডেলিভারি</p>
                      <p className="text-xs sm:text-sm text-cyan-600">
                        {order.deliveryStatus
                          ? "ডেলিভারি সম্পন্ন"
                          : "ডেলিভারিPending"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        order.paymentStatus ? "bg-green-500" : "bg-cyan-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-semibold text-cyan-800 text-sm sm:text-base">পেমেন্ট</p>
                      <p className="text-xs sm:text-sm text-cyan-600">
                        {order.paymentStatus
                          ? "পেমেন্ট সম্পন্ন"
                          : "পেমেন্টPending"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;