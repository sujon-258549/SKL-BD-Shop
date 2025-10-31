import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeOff, Lock, Shield, Key, ArrowLeft } from "lucide-react";
import { useChangePasswordMutation } from "../../redux/fetures/auth/authApi";
import { z } from "zod";

// Change Password Schema
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
     ,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const toastId = toast.loading("Changing password...", { duration: 2000 });

    try {
      const updatePassword = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      console.log(updatePassword)
      const res = await changePassword(updatePassword).unwrap();

      if (res.success) {
        toast.success("Password changed successfully!", { id: toastId });
        form.reset();
        setTimeout(() => navigate("/login"), 1500);
      } else {
        throw new Error(res.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change failed:", error);
      toast.error(
        error?.data?.message ||
          error.message ||
          "Failed to change password. Please try again.",
        { id: toastId, duration: 4000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Password Change Form */}
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2"></div>

          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cyan-800 font-semibold flex items-center">
                        <Key className="w-4 h-4 mr-2" />
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            {...field}
                            className="rounded-lg border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-cyan-700"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-cyan-600">
                        Enter your current account password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cyan-800 font-semibold flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Create a new password"
                            {...field}
                            className="rounded-lg border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-cyan-700"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-cyan-600">
                        Must be at least 8 characters with uppercase, lowercase,
                        number, and special character
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm New Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cyan-800 font-semibold flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            {...field}
                            className="rounded-lg border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-cyan-700"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-cyan-600">
                        Re-enter your new password to confirm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Password Requirements:
                  </h4>
                  <ul className="text-sm text-cyan-700 space-y-1">
                    <li className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          form.watch("newPassword")?.length >= 8
                            ? "bg-green-500"
                            : "bg-cyan-400"
                        }`}
                      ></div>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          /[A-Z]/.test(form.watch("newPassword") || "")
                            ? "bg-green-500"
                            : "bg-cyan-400"
                        }`}
                      ></div>
                      One uppercase letter (A-Z)
                    </li>
                    <li className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          /[a-z]/.test(form.watch("newPassword") || "")
                            ? "bg-green-500"
                            : "bg-cyan-400"
                        }`}
                      ></div>
                      One lowercase letter (a-z)
                    </li>
                    <li className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          /\d/.test(form.watch("newPassword") || "")
                            ? "bg-green-500"
                            : "bg-cyan-400"
                        }`}
                      ></div>
                      One number (0-9)
                    </li>
                    <li className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          /[@$!%*?&]/.test(form.watch("newPassword") || "")
                            ? "bg-green-500"
                            : "bg-cyan-400"
                        }`}
                      ></div>
                      One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/admin-profile")}
                    className="flex-1 border-cyan-600 cursor-pointer text-cyan-700 hover:bg-cyan-50 rounded-lg py-2 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white rounded-lg py-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Changing...
                      </div>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 text-center">
          <p className="text-sm text-cyan-600">
            <strong>Security Tip:</strong> Use a unique password that you don't
            use for other accounts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
