import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Camera } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  useGetMeQuery,
  useUpdateAdminMutation,
} from "@/redux/fetures/auth/authApi";
import { uploadProfileImage } from "../utility/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Update schema without email field
const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  profileImage: z.string().optional(),
});

type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;

const UpdateAdmin = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);

  const { data: profile, isLoading: profileLoading } = useGetMeQuery("");
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const navigate = useNavigate();

  const form = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      profileImage: "",
    },
  });

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        profileImage: profile.profileImage,
      });
      if (profile.profileImage) {
        setImagePreview(profile.profileImage);
      }
    }
  }, [profile, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCurrentFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string" || reader.result === null) {
          setImagePreview(reader.result);
        } else {
          setImagePreview(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateAdminFormData) => {
    const toastId = toast.loading("Updating profile...", { duration: 2000 });

    try {
      let imageUrl = data.profileImage;

      // Upload new image if selected
      if (currentFile) {
        imageUrl = await uploadProfileImage(currentFile);
      }

      const updateData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        profileImage: imageUrl,
      };

      const res = await updateAdmin(updateData).unwrap();
      console.log(res, updateData);
      if (res.success) {
        toast.success(res.message || "Profile updated successfully!", {
          id: toastId,
          duration: 2000,
        });
        setTimeout(() => navigate("/dashboard/profile"), 2000);
      } else {
        throw new Error(res.message || "Profile update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message, { id: toastId, duration: 4000 });
      } else {
        toast.error(
          error.message || "Something went wrong. Please try again.",
          {
            id: toastId,
            duration: 4000,
          }
        );
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-cyan-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2"></div>

          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-cyan-100 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-cyan-600 text-white p-2 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  </div>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-cyan-600 text-center">
                    Click the camera icon to update your profile picture
                  </p>
                </div>

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cyan-800 font-semibold flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="rounded-lg border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field (Read-only) */}
                <FormItem>
                  <FormLabel className="text-cyan-800 font-semibold flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile?.email || ""}
                      disabled
                      className="rounded-lg border-cyan-200 bg-cyan-50 text-cyan-700 cursor-not-allowed"
                    />
                  </FormControl>
                  <FormDescription className="text-cyan-600">
                    Email address cannot be changed for security reasons.
                  </FormDescription>
                </FormItem>

                {/* Phone Number Field */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cyan-800 font-semibold flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                          className="rounded-lg border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Field (Read-only) */}
                <FormItem>
                  <FormLabel className="text-cyan-800 font-semibold">
                    Account Role
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        value={
                          profile?.role ? profile.role.toUpperCase() : "ADMIN"
                        }
                        disabled
                        className="rounded-lg border-cyan-200 bg-cyan-50 text-cyan-700 cursor-not-allowed flex-1"
                      />
                      <div className="px-3 py-2 bg-cyan-100 text-cyan-800 rounded-lg text-sm font-semibold border border-cyan-200">
                        Cannot be changed
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-cyan-600">
                    Your administrator role provides full system access.
                  </FormDescription>
                </FormItem>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/admin-profile")}
                    className="flex-1 border-cyan-600 cursor-pointer text-cyan-700 hover:bg-cyan-50 rounded-lg py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white rounded-lg py-2"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-cyan-600">
            Need to change your password?{" "}
            <button
              onClick={() => navigate("/dashboard/change-password")}
              className="text-cyan-700 hover:text-cyan-800 font-semibold underline"
            >
              Change Password
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdmin;
