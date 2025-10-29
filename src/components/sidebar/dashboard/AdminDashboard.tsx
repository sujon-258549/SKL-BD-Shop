import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

import { useGetAllOrderQuery, useUpdateOrderStatusMutation } from "@/redux/fetures/auth/authApi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [isAcceptedFilter, setIsAcceptedFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deliveryStatusValue, setDeliveryStatusValue] = useState<boolean>(false);
  const [paymentStatusValue, setPaymentStatusValue] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // new loading state

  const { data: orderData, isLoading, refetch } = useGetAllOrderQuery(undefined);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = orderData?.data || [];

  const filteredOrders =
    isAcceptedFilter === "all"
      ? orders
      : orders.filter((order: any) => order.isAccepted === (isAcceptedFilter === "true"));

  const handleAcceptOrder = async (id: string) => {
    try {
      await updateOrderStatus({ id, data: { isAccepted: true } }).unwrap();
      toast.success("Order accepted successfully!");
      refetch();
    } catch (error: any) {
      toast.error("Failed to update order status!");
    }
  };

  const openModal = (order: any) => {
    setEditingOrder(order);
    setDeliveryStatusValue(order.deliveryStatus);
    setPaymentStatusValue(order.paymentStatus);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    setIsUpdating(true); // start loading
    try {
      await updateOrderStatus({
        id: editingOrder._id,
        data: { deliveryStatus: deliveryStatusValue, paymentStatus: paymentStatusValue },
      }).unwrap();
      toast.success("Order updated successfully!");
      setIsModalOpen(false);
      setEditingOrder(null);
      refetch();
    } catch (error: any) {
      toast.error("Failed to update order!");
    } finally {
      setIsUpdating(false); // stop loading
    }
  };

  return (
    <div className="">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            📦 All Orders
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Tabs for filter */}
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setIsAcceptedFilter("all")}>All</TabsTrigger>
              <TabsTrigger value="true" onClick={() => setIsAcceptedFilter("true")}>Accepted</TabsTrigger>
              <TabsTrigger value="false" onClick={() => setIsAcceptedFilter("false")}>Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <TableCaption>No orders found</TableCaption>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredOrders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>#{order._id.slice(-6)}</TableCell>

                      <TableCell>
                        <div className="text-sm font-medium text-gray-700">{order.customer?.name}</div>
                        <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                      </TableCell>

                      <TableCell>
                        <ul className="space-y-1">
                          {order.product?.map((p: any) => (
                            <li key={p.id?._id}>
                              {p.id?.name}{" "}
                              <Badge variant="outline" className="ml-1">x{p.orderQuantity}</Badge>
                            </li>
                          ))}
                        </ul>
                      </TableCell>

                      <TableCell className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</TableCell>

                      <TableCell>
                        <Badge className={order.deliveryStatus ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                          {order.deliveryStatus ? "Delivered" : "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className={order.paymentStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {order.paymentStatus ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm text-gray-700">{order.address?.address}</div>
                        <div className="text-xs text-gray-500">{order.address?.district}</div>
                      </TableCell>

                      <TableCell className="flex gap-2">
                        {order.isAccepted ? (
                          <Badge className="bg-green-100 text-green-700">Accepted</Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleAcceptOrder(order._id)}>Accept</Button>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => openModal(order)}>Update</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-2">
                <div>
                  <label className="text-sm font-medium">Delivery Status</label>
                  <Select value={deliveryStatusValue ? "true" : "false"} onValueChange={val => setDeliveryStatusValue(val === "true")}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue>{deliveryStatusValue ? "Delivered" : "Pending"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Delivered</SelectItem>
                      <SelectItem value="false">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select value={paymentStatusValue ? "true" : "false"} onValueChange={val => setPaymentStatusValue(val === "true")}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue>{paymentStatusValue ? "Paid" : "Unpaid"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Paid</SelectItem>
                      <SelectItem value="false">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={handleUpdateOrder} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" /> : null}
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUpdating}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
