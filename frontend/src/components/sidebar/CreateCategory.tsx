import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BiSolidCategory } from "react-icons/bi";
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
import Loading from "../common/loding/Loading";
import LoadingPage from "../common/loding/LoadingPage";



import { uploadProfileImage } from "../utility/imageUpload";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoryQuery, useUpdateCategoryMutation } from "@/redux/fetures/auth/authApi";

interface CategoryFormValues {
  name: string;
  description: string;
}

export interface TCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const CreateCategory: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoryQuery("");

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: CategoryFormValues) => {
    const toastId = toast.loading(editingCategory ? "Updating category..." : "Creating category...");
    try {
      let imageUrl = editingCategory?.image || "";
      if (currentFile) imageUrl = await uploadProfileImage(currentFile);

      const payload = { ...data, image: imageUrl };

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, data: payload }).unwrap();
        toast.success("Category updated successfully!", { id: toastId });
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully!", { id: toastId });
      }

      form.reset();
      setCurrentFile(undefined);
      setEditingCategory(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      const message =
        error?.data?.message || error.message || "Something went wrong!";
      toast.error(message, { id: toastId });
    }
  };

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const toastId = toast.loading("Deleting category...");
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete category", { id: toastId });
      }
    }
  };

  if (isLoadingCategories) return <LoadingPage />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="text-white cursor-pointer"
              onClick={() => {
                setEditingCategory(null);
                form.reset();
              }}
            >
              <BiSolidCategory className="mr-2" />{" "}
              {editingCategory ? "Edit Category" : "Add Category"}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category details below."
                  : "Fill out the form to create a new category."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Category name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter category name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter category description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full text-white cursor-pointer"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? <Loading /> : editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories?.length > 0 ? (
                categories.map((category: TCategory, index: number) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description || "N/A"}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(category._id)}
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No categories found
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

export default CreateCategory;
