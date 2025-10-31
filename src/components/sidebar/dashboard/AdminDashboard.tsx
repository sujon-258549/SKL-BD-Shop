import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Trash2,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Eye,
  Calendar,
  Clock,
  Edit,
  ShoppingCart,
} from "lucide-react";

import {
  useGetAllOrderQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "@/redux/fetures/auth/authApi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";
import AdminDashboardCards from "./AdminDashboardCards";

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAcceptedFilter, setIsAcceptedFilter] = useState<string | undefined>(
    undefined
  );

  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingOrder, setDeletingOrder] = useState<any>(null);
  const [deliveryStatusValue, setDeliveryStatusValue] = useState<boolean>(false);
  const [paymentStatusValue, setPaymentStatusValue] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  // Build query parameters for pagination and filtering
  const queryParams: any = [
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
  ];

  if (isAcceptedFilter !== undefined) {
    queryParams.push({ name: "isAccepted", value: isAcceptedFilter });
  }

  const {
    data: orderData,
    isLoading,
    refetch,
  } = useGetAllOrderQuery(queryParams);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const orders = orderData?.data || [];
  const meta = orderData?.meta || [];

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleAcceptOrder = async (id: string) => {
    try {
      await updateOrderStatus({ id, data: { isAccepted: true } }).unwrap();
      toast.success("অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!");
      refetch();
    } catch (error: any) {
      toast.error("অর্ডার স্ট্যাটাস আপডেট ব্যর্থ হয়েছে!");
    }
  };

  const openModal = (order: any) => {
    setEditingOrder(order);
    setDeliveryStatusValue(order.deliveryStatus);
    setPaymentStatusValue(order.paymentStatus);
    setIsModalOpen(true);
  };

  const openDeleteModal = (order: any) => {
    setDeletingOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/dashboard/order-details/${orderId}`);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus({
        id: editingOrder._id,
        data: {
          deliveryStatus: deliveryStatusValue,
          paymentStatus: paymentStatusValue,
        },
      }).unwrap();
      toast.success("অর্ডার সফলভাবে আপডেট করা হয়েছে!");
      setIsModalOpen(false);
      setEditingOrder(null);
      refetch();
    } catch (error: any) {
      toast.error("অর্ডার আপডেট ব্যর্থ হয়েছে!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    try {
      await deleteOrder(deletingOrder._id).unwrap();
      toast.success("অর্ডার সফলভাবে ডিলিট করা হয়েছে!");
      setIsDeleteModalOpen(false);
      setDeletingOrder(null);
      refetch();
    } catch (error: any) {
      toast.error("অর্ডার ডিলিট ব্যর্থ হয়েছে!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleTabChange = (value: string) => {
    if (value === "all") {
      setIsAcceptedFilter(undefined);
    } else {
      setIsAcceptedFilter(value);
    }
    setCurrentPage(1); // Reset to first page when changing filter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <AdminDashboardCards />
      <div className="max-w-7xl mx-auto">
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2"></div>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-semibold text-cyan-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                সকল অর্ডার
              </CardTitle>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-cyan-700">প্রদর্শন:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-20 border-cyan-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">৫</SelectItem>
                    <SelectItem value="10">১০</SelectItem>
                    <SelectItem value="20">২০</SelectItem>
                    <SelectItem value="50">৫০</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-cyan-700">প্রতি পৃষ্ঠায়</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Tabs for filter */}
            <Tabs
              defaultValue="all"
              className="mb-6"
              onValueChange={handleTabChange}
            >
              <TabsList className="bg-cyan-50 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-md"
                >
                  সকল অর্ডার
                </TabsTrigger>
                <TabsTrigger
                  value="true"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-md"
                >
                  গৃহীত
                </TabsTrigger>
                <TabsTrigger
                  value="false"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-md"
                >
                  মুলতুবি
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
                  <p className="text-cyan-700 font-medium">অর্ডার লোড হচ্ছে...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-cyan-800 mb-2">
                  কোন অর্ডার পাওয়া যায়নি
                </h3>
                <p className="text-cyan-600">
                  আপনার বর্তমান ফিল্টার критериার সাথে মিলছে না।
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-cyan-200 mb-6">
                  <Table>
                    <TableHeader className="bg-cyan-50">
                      <TableRow>
                        <TableHead className="text-cyan-800 font-semibold">
                          অর্ডার আইডি
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          তারিখ ও সময়
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          গ্রাহক
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          পণ্য সমূহ
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          মোট টাকা
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          ডেলিভারি
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          পেমেন্ট
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          ঠিকানা
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold">
                          স্ট্যাটাস
                        </TableHead>
                        <TableHead className="text-cyan-800 font-semibold text-center">
                          কর্ম
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orders.map((order: any, index: number) => {
                        const formattedDate = formatDateTime(
                          order.createdAt || order.orderDate
                        );
                        return (
                          <TableRow
                            key={order._id}
                            className="hover:bg-cyan-50 transition-colors"
                          >
                            <TableCell className="font-mono text-cyan-700 font-medium">
                              #{index + 1}
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-sm text-cyan-800">
                                  <Calendar className="w-3 h-3" />
                                  {formattedDate.date}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-cyan-600">
                                  <Clock className="w-3 h-3" />
                                  {formattedDate.time}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm font-medium text-cyan-900">
                                {order.customer?.name}
                              </div>
                              <div className="text-xs text-cyan-600">
                                {order.customer?.phone}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-2">
                                {order.product?.map((p: any) => (
                                  <div
                                    key={p.id?._id}
                                    className="flex items-center justify-between bg-cyan-50 px-3 py-2 rounded-lg border border-cyan-200"
                                  >
                                    <div className="flex-1">
                                      <span className="text-sm font-medium text-cyan-800 line-clamp-1">
                                        {p.id?.name || "অজানা পণ্য"}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 bg-cyan-100 text-cyan-700 border-cyan-300 font-semibold min-w-[70px] justify-center"
                                    >
                                      <ShoppingCart className="w-3 h-3 mr-1" />
                                      {p.orderQuantity} pcs
                                    </Badge>
                                  </div>
                                ))}
                                <div className="text-xs text-cyan-600 font-medium mt-2 text-center">
                                  মোট: {order.product?.length} টি পণ্য
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="font-semibold text-cyan-900">
                              <div className="flex items-center gap-1">
                                <FaBangladeshiTakaSign  className="w-4 h-4 text-green-600" />
                                {order.totalAmount.toFixed(2)}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={
                                  order.deliveryStatus
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-cyan-100 text-cyan-700 border-cyan-200"
                                }
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                {order.deliveryStatus ? "ডেলিভারি হয়েছে" : "মুলতুবি"}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={
                                  order.paymentStatus
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-cyan-100 text-cyan-700 border-cyan-200"
                                }
                              >
                                <CreditCard className="w-3 h-3 mr-1" />
                                {order.paymentStatus ? "পেড" : "অপেক্ষমান"}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm text-cyan-800">
                                {order.address?.address}
                              </div>
                              <div className="text-xs text-cyan-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {order.address?.district}
                              </div>
                            </TableCell>

                            <TableCell>
                              <button
                                className={` ${
                                  order.isAccepted
                                    ? "bg-green-500  text-white"
                                    : "bg-orange-500 সকল অর্ডার text-white"
                                } px-3 py-1 rounded`}
                              >
                                <Badge
                                  onClick={() => handleAcceptOrder(order._id)}
                                  className="bg-transparent সকল অর্ডার text-white"
                                >
                                  {order.isAccepted ? "গৃহীত" : "মুলতুবি"}
                                </Badge>
                              </button>
                            </TableCell>

                            <TableCell>
                              <div className="flex justify-center gap-1">
                                {/* Update Button */}
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openModal(order)}
                                  className="h-8 w-8 p-0 cursor-pointer bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-200"
                                  title="অর্ডার আপডেট করুন"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                {/* Details Button */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(order._id)}
                                  className="h-8 w-8 p-0 border-cyan-600 cursor-pointer  text-cyan-700 hover:bg-blue-50 hover:text-blue-800"
                                  title="বিস্তারিত দেখুন"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                {/* Delete Button */}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openDeleteModal(order)}
                                  className="h-8 w-8 p-0 bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 border-red-200"
                                  title="অর্ডার ডিলিট করুন"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {/* Update Order Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-[425px] border-0 shadow-2xl rounded-2xl">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 w-full"></div>
                <DialogHeader className="pt-4">
                  <DialogTitle className="text-cyan-800 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    অর্ডার স্ট্যাটাস আপডেট করুন
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <label className="text-sm font-medium text-cyan-700 flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4" />
                      ডেলিভারি স্ট্যাটাস
                    </label>
                    <Select
                      value={deliveryStatusValue ? "true" : "false"}
                      onValueChange={(val) =>
                        setDeliveryStatusValue(val === "true")
                      }
                    >
                      <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue>
                          {deliveryStatusValue ? "ডেলিভারি হয়েছে" : "মুলতুবি"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true" className="text-cyan-700">
                          ডেলিভারি হয়েছে
                        </SelectItem>
                        <SelectItem value="false" className="text-cyan-700">
                          মুলতুবি
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-cyan-700 flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4" />
                      পেমেন্ট স্ট্যাটাস
                    </label>
                    <Select
                      value={paymentStatusValue ? "true" : "false"}
                      onValueChange={(val) =>
                        setPaymentStatusValue(val === "true")
                      }
                    >
                      <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue>
                          {paymentStatusValue ? "পেড" : "অপেক্ষমান"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true" className="text-cyan-700">
                          পেড
                        </SelectItem>
                        <SelectItem value="false" className="text-cyan-700">
                          অপেক্ষমান
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isUpdating}
                    className="border-cyan-600 text-cyan-700 hover:bg-cyan-50"
                  >
                    বাতিল
                  </Button>
                  <Button
                    onClick={handleUpdateOrder}
                    disabled={isUpdating}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        আপডেট হচ্ছে...
                      </div>
                    ) : (
                      "পরিবর্তনগুলি সংরক্ষণ করুন"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
              open={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
            >
              <DialogContent className="sm:max-w-[425px] border-0 shadow-2xl rounded-2xl">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 w-full"></div>
                <DialogHeader className="pt-4">
                  <DialogTitle className="flex items-center gap-2 text-cyan-800">
                    <Trash2 className="w-5 h-5" />
                    অর্ডার ডিলিট করুন
                  </DialogTitle>
                  <DialogDescription className="text-cyan-600">
                    আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি ডিলিট করতে চান? এই কর্মটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।
                  </DialogDescription>
                </DialogHeader>

                {deletingOrder && (
                  <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                    <h4 className="font-semibold text-cyan-800 mb-3">
                      অর্ডার বিবরণ:
                    </h4>
                    <div className="text-sm text-cyan-700 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">অর্ডার আইডি:</span>
                        <span className="font-mono">
                          #{deletingOrder._id.slice(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">গ্রাহক:</span>
                        <span>{deletingOrder.customer?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">মোট টাকা:</span>
                        <span className="font-semibold flex items-center gap-1">
                          <FaBangladeshiTakaSign  className="w-3 h-3" />
                          {deletingOrder.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">পণ্য:</span>
                        <span>{deletingOrder.product?.length} টি আইটেম</span>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="border-cyan-600 text-cyan-700 hover:bg-cyan-50"
                  >
                    বাতিল
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteOrder}
                    disabled={isDeleting}
                    className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        ডিলিট হচ্ছে...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        অর্ডার ডিলিট করুন
                      </div>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
          <div>
            <ResponsivePagination
              current={currentPage}
              // @ts-expect-error total
              total={Number(meta.totalPage) || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;