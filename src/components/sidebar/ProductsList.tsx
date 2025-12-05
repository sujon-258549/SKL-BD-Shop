import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BiSolidPackage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
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
import type { TProduct, TCategory } from "../allProduct/type";

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
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

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

  // ---------- Handle Multiple File Selection ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCurrentFiles((prev) => [...prev, ...files]);
    }
  };

  // ---------- Remove Image from Selection ----------
  const handleRemoveImage = (index: number) => {
    setCurrentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Remove Existing Image URL ----------
  const handleRemoveImageUrl = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Submit Handler ----------
  const handleSubmit = async (data: ProductFormValues) => {
    const toastId = toast.loading(
      editingProduct ? "Updating product..." : "Creating product..."
    );
    try {
      let imageUrls: string[] = [];

      // Start with existing images that user kept (uploadedImageUrls)
      if (editingProduct) {
        imageUrls = [...uploadedImageUrls];
      }

      // Upload new images and add to array
      if (currentFiles.length > 0) {
        const uploadPromises = currentFiles.map((file) => uploadProfileImage(file));
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Use first image as primary photo for backward compatibility

      const payload = {
        ...data,
        photos: imageUrls, // New field for multiple images
        price: Number(data.price),
        stock: Number(data.stock),
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, data: payload }).unwrap();
        toast.success("✅ Product updated successfully!", { id: toastId });
      } else {
        await createProduct(payload).unwrap();
        toast.success("✅ Product created successfully!", { id: toastId });
      }

      form.reset();
      setCurrentFiles([]);
      setUploadedImageUrls([]);
      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const errorObj = error as { data?: { message?: string }; message?: string };
      const message =
        errorObj?.data?.message || errorObj?.message || "Something went wrong!";
      toast.error(message, { id: toastId });
    }
  };

  // ---------- Edit Handler ----------
  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    
    // Initialize existing images
    const existingImages = Array.isArray(product.photos)
      ? product.photos
      : product.photo
      ? Array.isArray(product.photo)
        ? product.photo
        : [product.photo]
      : [];
    setUploadedImageUrls(existingImages.filter((img): img is string => typeof img === "string"));
    setCurrentFiles([]);
    
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
      } catch (error: unknown) {
        const errorObj = error as { data?: { message?: string } };
        toast.error(errorObj?.data?.message || "Failed to delete product", {
          id: toastId,
        });
      }
    }
  };

  if (isLoadingProducts || isFetching) return <LoadingPage />;

  // ---------- Main UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            🛍️ Products Management
          </h2>
          <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
            Manage and monitor your product list
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setCurrentFiles([]);
              setUploadedImageUrls([]);
              setEditingProduct(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
              onClick={() => {
                setEditingProduct(null);
                setCurrentFiles([]);
                setUploadedImageUrls([]);
                form.reset();
              }}
            >
              <BiSolidPackage className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 rounded-2xl">
            <DialogHeader className="pb-4 border-b-2 border-gray-200">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
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
                              categories?.map((cat: TCategory) => (
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

                {/* Multiple Image Upload Section */}
                <div className="border rounded-lg p-4 space-y-4">
                  <FormLabel>Product Images</FormLabel>
                  
                  {/* File Input */}
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can select multiple images at once
                  </p>

                  {/* Preview Section for New Files */}
                  {currentFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        New Images ({currentFiles.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {currentFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors shadow-sm"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              aria-label="Remove image"
                            >
                              <RxCross2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview Section for Existing Images (when editing) */}
                  {uploadedImageUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Current Images ({uploadedImageUrls.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {uploadedImageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors shadow-sm"
                          >
                            <img
                              src={url}
                              alt={`Product image ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImageUrl(index)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              aria-label="Remove image"
                            >
                              <RxCross2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {currentFiles.length === 0 && uploadedImageUrls.length === 0 && (
                    <div className="mt-4 text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white/50">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">
                          No images selected. Click above to add images.
                        </p>
                      </div>
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
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg sm:shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {[
                  "#",
                  "Image",
                  "Name",
                  "Price",
                  "Stock",
                  "Brand",
                  "Images",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.length > 0 ? (
                products.map((product: TProduct, index: number) => (
                  <tr key={product._id} className="hover:bg-cyan-50/50 transition-colors border-b border-gray-100">
                    <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <img
                        src={
                          Array.isArray(product.photos) && product.photos.length > 0
                            ? product.photos[0]
                            : Array.isArray(product.photo) && product.photo.length > 0
                            ? product.photo[0]
                            : typeof product.photo === "string"
                            ? product.photo
                            : ""
                        }
                        alt={product.name}
                        className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-900 max-w-[200px] truncate">
                      {product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-cyan-600">
                      <span className="text-lg font-extrabold mr-1">৳</span>
                      {product.price.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-700">
                      {product.stock}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {product.brand || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                        {Array.isArray(product.photos)
                          ? product.photos.length
                          : product.photo
                          ? 1
                          : 0} images
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-cyan-600 border-cyan-300 cursor-pointer hover:bg-cyan-50 hover:border-cyan-400 font-semibold shadow-sm hover:shadow transition-all"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 cursor-pointer hover:bg-red-50 hover:border-red-400 font-semibold shadow-sm hover:shadow transition-all"
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
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
    </div>
  );
};

export default ProductsList;
