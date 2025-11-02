import { Card, CardContent } from "@/components/ui/card";
import { useAdminDashboardQuery } from "@/redux/fetures/auth/authApi";
import {
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  Users,
  Box,
  TrendingUp,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const AdminDashboardCards = () => {
  const { data: statusData, isLoading: statusLoading , isFetching} =
    useAdminDashboardQuery(undefined);

  if (statusLoading || isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const dashboardData = statusData || {};

  const cardsData = [
    {
      title: "মোট আয়",
      value: `${dashboardData.totalRevenue?.toLocaleString() || 0}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      description: "মোট বিক্রয় আয়",
    },
    {
      title: "মোট অর্ডার",
      value: dashboardData.totalOrders || 0,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      description: "সর্বমোট অর্ডার সংখ্যা",
    },
    {
      title: "ডেলিভারি সম্পন্ন",
      value: dashboardData.deliveredOrders || 0,
      icon: CheckCircle,
      gradient: "from-green-400 to-teal-500",
      description: "সফলভাবে ডেলিভারী হয়েছে",
    },
    {
      title: "পেন্ডিং অর্ডার",
      value: dashboardData.pendingOrders || 0,
      icon: Clock,
      gradient: "from-amber-400 to-orange-500",
      description: "প্রসেসিং অপেক্ষায়",
    },
    {
      title: "চলমান অর্ডার",
      value: dashboardData.processingOrders || 0,
      icon: Truck,
      gradient: "from-indigo-500 to-purple-500",
      description: "ডেলিভারি চলছে",
    },
    {
      title: "মোট প্রোডাক্ট",
      value: dashboardData.productLength || 0,
      icon: Package,
      gradient: "from-cyan-500 to-blue-600",
      description: "স্টকে প্রোডাক্ট সংখ্যা",
    },
    {
      title: "মোট ক্যাটাগরি",
      value: dashboardData.categoryLength || 0,
      icon: Box,
      gradient: "from-pink-500 to-rose-600",
      description: "পণ্যের ক্যাটাগরি",
    },
    {
      title: "বিক্রি হওয়া পরিমাণ",
      value: dashboardData.totalQuantity || 0,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      description: "মোট বিক্রিত আইটেম",
    },
  ];

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 mb-4 lg:grid-cols-4 gap-3">
          {cardsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="h-[100px] max-h-[120px] rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-1"
              >
                <CardContent className="p-4 h-full flex items-center justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {card.value
                        .toString()
                        .replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d])}
                    </h2>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>

                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCards;
