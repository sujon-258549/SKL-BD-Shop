import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BiSolidPackage } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "../common/loding/Loading";
import LoadingPage from "../common/loding/LoadingPage";
import { uploadProfileImage } from "../utility/imageUpload";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllCategoryQuery,
  useGetAllProductQuery,
  useUpdateProductMutation,
} from "@/redux/fetures/auth/authApi";

// ---------- Product Form Type ----------
interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  category: string;
}

const ProductsList: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  console.log(currentFile);

  // ---------- API Hooks ----------
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const { data: productsResponse, isLoading: isLoadingProducts , isFetching} =
    useGetAllProductQuery("");
  const products = productsResponse?.data || [];

  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategoryQuery(undefined);

  // ---------- React Hook Form ----------
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      brand: "",
      category: "",
    },
    mode: "onChange",
  });

  // ---------- Submit Handler ----------
  const handleSubmit = async (data: ProductFormValues) => {
    const toastId = toast.loading(
      editingProduct ? "Updating product..." : "Creating product..."
    );
    try {
      let imageUrl = editingProduct?.photo || "";
      if (currentFile) imageUrl = await uploadProfileImage(currentFile);
      console.log(imageUrl);

      const payload = {
        ...data,
        photo: imageUrl,
        price: Number(data.price),
        stock: Number(data.stock),
      };

      console.log(payload);

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, data: payload }).unwrap();
        toast.success("✅ Product updated successfully!", { id: toastId });
      } else {
        await createProduct(payload).unwrap();
        toast.success("✅ Product created successfully!", { id: toastId });
      }

      form.reset();
      setCurrentFile(undefined);
      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      const message =
        error?.data?.message || error.message || "Something went wrong!";
      toast.error(message, { id: toastId });
    }
  };

  // ---------- Edit Handler ----------
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      brand: product.brand || "",
      category: product.category?._id || product.category || "",
    });
    setIsDialogOpen(true);
  };

  // ---------- Delete Handler ----------
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const toastId = toast.loading("Deleting product...");
      try {
        await deleteProduct(id).unwrap();
        toast.success("🗑️ Product deleted successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete product", {
          id: toastId,
        });
      }
    }
  };

  if (isLoadingProducts || isFetching) return <LoadingPage />;

  // ---------- Main UI ----------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">🛍️ Products</h2>
          <p className="text-gray-600 mt-1">
            Manage and monitor your product list
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="text-white cursor-pointer"
              onClick={() => {
                setEditingProduct(null);
                form.reset();
              }}
            >
              <BiSolidPackage className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the product details below."
                  : "Fill out the form to create a new product."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mt-4 space-y-4"
              >
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Product name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="0.00"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    rules={{ required: "Stock is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="0"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter brand name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Dropdown */}
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoadingCategories}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoadingCategories
                                  ? "Loading categories..."
                                  : "Select a category"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.length > 0 ? (
                              categories?.map((cat: any) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                  {cat.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No categories found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                {/* Image Upload */}
                <div className="border rounded-lg p-4">
                  <FormLabel>Product Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCurrentFile(e.target.files?.[0])}
                    className="mt-2"
                  />

                  {/* 🔥 Show new image preview */}
                  {currentFile && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Preview:</p>
                      <img
                        src={URL.createObjectURL(currentFile)}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border mt-1"
                      />
                    </div>
                  )}

                  {/* 🔁 Show old image if editing and no new file selected */}
                  {!currentFile && editingProduct?.photo && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Current Image:</p>
                      <img
                        src={editingProduct.photo}
                        alt={editingProduct.name}
                        className="h-20 w-20 object-cover rounded-lg border mt-1"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-white cursor-pointer"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <Loading />
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "#",
                  "Image",
                  "Name",
                  "Price",
                  "Stock",
                  "Brand",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.length > 0 ? (
                products.map((product: any, index: number) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={product.photo}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-lg border"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <span className="text-xl font-bold mr-1">৳</span>
                      {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.brand || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-cyan-600 border-cyan-200 cursor-pointer hover:bg-blue-50"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 cursor-pointer hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
