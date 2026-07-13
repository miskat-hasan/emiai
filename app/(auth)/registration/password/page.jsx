"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

export default function RegistrationPasswordPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Guard: need both previous steps
  useEffect(() => {
    const role = sessionStorage.getItem("reg_role");
    const info = sessionStorage.getItem("reg_info");
    if (!role || !info) router.replace("/registration");
  }, [router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ password, password_confirmation }) => {
    const role = sessionStorage.getItem("reg_role");
    const info = JSON.parse(sessionStorage.getItem("reg_info") ?? "{}");

    try {
      const res = await registerUser({
        role,
        name: info.name,
        email: info.email,
        phone: info.phone,
        country: info.country,
        password,
        password_confirmation,
        agree_to_terms: 1,
      }).unwrap();

      if (res?.success) {
        toast.success(
          res.message ?? "Account created! Please verify your email.",
        );
        // Keep email for OTP step
        sessionStorage.setItem("reg_email", info.email);
        router.push("/registration/verify-otp");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ?? "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Set Your Password</h1>
        <p className="text-sm text-gray mt-1">
          Choose a strong password to secure your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <AuthInput
          label="Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          registration={register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
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
            Create Account
          </AuthButton>
        </div>
      </form>

      <p className="text-center text-sm text-gray">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
