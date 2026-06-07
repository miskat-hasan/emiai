"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Guard: if session data is missing, send back to step 1
  useEffect(() => {
    const token = sessionStorage.getItem("fp_token");
    const email = sessionStorage.getItem("fp_email");
    if (!token || !email) router.replace("/forgot-password");
  }, [router]);

  const onSubmit = async ({ password, password_confirmation }) => {
    const token = sessionStorage.getItem("fp_token");
    const email = sessionStorage.getItem("fp_email");

    try {
      const res = await resetPassword({
        email,
        token,
        password,
        password_confirmation,
      }).unwrap();

      if (res?.success) {
        toast.success(res.message ?? "Password reset successfully!");
        // Clean up session
        sessionStorage.removeItem("fp_email");
        sessionStorage.removeItem("fp_token");
        sessionStorage.removeItem("fp_otp_hint");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Reset failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#203430]">Reset Password</h1>
        <p className="text-sm text-[#63716E] mt-1">
          Choose a strong new password for your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <AuthInput
          label="New Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.password_confirmation?.message}
          registration={register("password_confirmation", {
            required: "Please confirm your password",
            validate: val =>
              val === watch("password") || "Passwords do not match",
          })}
        />

        <div className="mt-2">
          <AuthButton type="submit" loading={isLoading}>
            Reset Password
          </AuthButton>
        </div>
      </form>
    </div>
  );
}
