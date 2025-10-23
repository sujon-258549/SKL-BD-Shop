import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Order Form Component
const OrderForm = ({ productName }: { productName: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order Data:", formData);
    toast.success(`Order for ${productName} submitted!`, { duration: 2000 });
    setFormData({ name: "", email: "", address: "", quantity: 1 });
  };

  return (
    <Card className="p-4 border-cyan-800 border-2 rounded-lg mt-4">
      <CardContent className="p-0">
        <h2 className="text-lg font-semibold mb-3">Order Now</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            required
            className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Quantity:</label>
            <input
              type="number"
              name="quantity"
              min={1}
              max={10}
              value={formData.quantity}
              onChange={handleChange}
              className="p-2 text-sm border border-gray-300 rounded-lg w-20 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-cyan-700 hover:bg-cyan-800 text-white mt-2 py-3 text-sm font-medium"
          >
            Place Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Main Product Details Page
export default function ProductDetailsMobile() {
  const product = {
    name: "Premium Wireless Headphones",
    discount: 99,
    price: 120,
    stockStatus: true,
    reviewsCount: 12,
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    photo: "https://via.placeholder.com/400x300?text=Premium+Headphones",
    colors: ["Black", "Silver", "Blue", "Red"],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        {/* Product Image */}
       

        {/* Product Info */}
        <Card className="rounded-xl shadow-lg border-0 p-4">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {product.stockStatus ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {"★".repeat(5)}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">${product.discount}</span>
            <span className="text-lg text-gray-500 line-through">${product.price}</span>
            <Badge className="bg-red-500 text-white ml-2">
              Save ${product.price - product.discount}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Color: {selectedColor}</div>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  className={`px-3 py-2 text-xs border-2 ${
                    selectedColor === color 
                      ? "bg-cyan-600 text-white border-cyan-600" 
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <OrderForm productName={product.name} />
        </Card>

        
      </div>
    </div>
  );
}