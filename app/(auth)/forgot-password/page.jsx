"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await forgotPassword({ email }).unwrap();

      if (res?.success) {
        toast.success(res.message ?? "OTP sent to your email");
        sessionStorage.setItem("fp_email", email);
        if (res?.data?.otp) {
          sessionStorage.setItem("fp_otp_hint", String(res.data.otp));
        }
        router.push("/forgot-password/verify-otp");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Forgot Password</h1>
        <p className="text-sm text-gray mt-1">
          Enter your email and we&apos;ll send you a reset code.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="e.g. sarah.johnson@email.com"
          error={errors.email?.message}
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <div className="mt-2">
          <AuthButton type="submit" loading={isLoading}>
            Send Code
          </AuthButton>
        </div>
      </form>

      <p className="text-center text-sm text-gray">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
