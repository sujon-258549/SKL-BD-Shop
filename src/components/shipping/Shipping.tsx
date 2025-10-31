import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/fetures/hooks";
import {
  clearAllCart,
  clearCart,
  decrementProductQuantity,
  deliveryAmount,
  deliveryAmountValue,
  incrementProductQuantity,
  orderSelector,
} from "@/redux/fetures/card/shippingSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { districts } from "./district";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/redux/fetures/auth/authApi";
import { userCurrentUser } from "@/redux/fetures/auth/authSlice";
import { Link } from "react-router-dom";

// ...imports stay the same

const Shipping = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(orderSelector);
  const deliveryCost = useAppSelector(deliveryAmountValue);
  const user = useAppSelector(userCurrentUser) as any;

  const [name, setName] = useState(user?.userInfo?.name || "");
  const [phone, setPhone] = useState(user?.userInfo?.phone || "");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    dispatch(deliveryAmount(district));
  }, [district, dispatch]);

  // Quantity handlers
  const incrementQuantity = (product: any) =>
    dispatch(incrementProductQuantity(product));
  const decrementQuantity = (product: any) =>
    dispatch(decrementProductQuantity(product));
  const removeItem = (product: any) => dispatch(clearCart(product));

  // Price calculations
  const subtotal = products.reduce(
    (total, item) => total + Number(item.price) * Number(item.orderQuantity),
    0
  );
  const totalPrice = subtotal + deliveryCost;

  const handleOrder = async () => {
    const toastId = toast.loading("Processing order...", { duration: 2000 });

    if (!name || !phone || !address) {
      toast.error("দয়া করে সকল তথ্য পূরণ করুন", { id: toastId });
      return;
    }

    const orderPayload = {
      product: products.map((product) => ({
        id: product._id,
        orderQuantity: product.orderQuantity,
      })),
      customer: {
        name,
        phone,
      },
      address: {
        address,
        district,
      },
      totalAmount: totalPrice,
    };

    console.log(orderPayload);

    try {
      const res = await createOrder(orderPayload);

      if (res?.data?.success) {
        toast.success(res.data.message || "Order placed successfully", {
          id: toastId,
          duration: 2000,
        });

        // ✅ Clear cart after successful order
        dispatch(clearAllCart());
      } else {
        toast.error(res?.data?.message || "Failed to place order", {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-8 w-8 text-cyan-600 mr-3 dark:text-cyan-400" />
          <h1 className=" text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <Badge
            variant="outline"
            className="ml-4 bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-100 dark:border-cyan-700"
          >
            {products.length} {products.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {products.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6 dark:text-gray-400">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/">
                <Button className="text-white">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="lg:flex lg:items-start lg:gap-4">
            {/* Cart Items */}
            <div className="lg:flex-1 space-y-2">
              {products.map((item) => (
                <Card
                  key={item._id}
                  className="overflow-hidden border border-gray-200 dark:border-gray-700 py-6"
                >
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="h-28 w-28 rounded-lg object-contain border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="h-28 w-28 rounded-lg bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-sm mt-3 text-gray-900 truncate dark:text-white">
                          {item.name || "Unnamed Product"}
                        </h3>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border-2 rounded-md border-cyan-800 dark:border-gray-600">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => decrementQuantity(item)}
                            >
                              <Minus className="h-4 w-4 text-cyan-800" />
                            </Button>
                            <Input
                              type="text"
                              value={item.orderQuantity}
                              readOnly
                              className="h-8 w-12 text-center border-0 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => incrementQuantity(item)}
                            >
                              <Plus className="h-4 w-4 text-cyan-800" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {Number(item.price) * Number(item.orderQuantity)}{" "}
                              Take
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 mt-1 mb-3">
                          <Badge className="text-white flex items-center gap-1">
                            Remove This Cart <MoveRight />
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => removeItem(item)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 lg:mt-0 lg:w-96">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-cyan-50 dark:bg-cyan-900/20">
                  <CardTitle className="text-xl text-cyan-800 dark:text-cyan-200">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subtotal} Take
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Delivery Cost
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {deliveryCost} Take
                    </span>
                  </div>

                  <div className="md:p-6 p-2 bg-gray-50 flex flex-col space-y-4">
                    {/* Name Input */}
                    <div>
                      <p className="text-lg font-medium mb-2 text-cyan-900">
                        Your Name
                      </p>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-cyan-800 rounded-md p-2 w-full"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <p className="text-lg font-medium mb-2 text-cyan-900">
                        Phone Number
                      </p>
                      <Input
                        type="text"
                        placeholder="Enter your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border border-cyan-800 rounded-md p-2 w-full"
                      />
                    </div>

                    {/* District Selection */}
                    <p className="text-lg font-medium mb-2 text-cyan-900">
                      Select District
                    </p>
                    <Select onValueChange={setDistrict}>
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

                    {district && (
                      <p className="mt-2 text-cyan-800 font-semibold">
                        Selected: {district}
                      </p>
                    )}

                    {/* Address Input */}
                    <div>
                      <p className="mt-4">Enter your Address</p>
                      <Input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border mt-2 border-cyan-800 rounded-md p-2"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-cyan-700 dark:text-cyan-400">
                      {totalPrice.toFixed()} Take
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <Button onClick={handleOrder} className="w-full cursor-pointer text-white">
                    Confirm Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipping;
