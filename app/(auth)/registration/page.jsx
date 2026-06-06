"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegistrationPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async data => {
    try {
      // Store step-1 data and proceed to step 2 (role selection / password)
      // Replace with your actual registration API call or step navigation
      sessionStorage.setItem("reg_step1", JSON.stringify(data));
      router.push("/registration/step2");
    } catch (err) {
      toast.error(
        err?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#203430]">Join the Network</h1>
        <p className="text-sm text-[#63716E] mt-1">
          Create your account and start connecting today.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <AuthInput
          label="Name"
          type="text"
          placeholder="e.g. Johnson"
          error={errors.name?.message}
          registration={register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="e.g. jonson@gmailcom"
          error={errors.email?.message}
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <AuthInput
          label="Phone Number"
          type="tel"
          placeholder="+880 123 654 7896"
          error={errors.phone?.message}
          registration={register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^\+?[\d\s\-()]{7,15}$/,
              message: "Enter a valid phone number",
            },
          })}
        />

        <AuthInput
          label="Country"
          type="text"
          placeholder="Country"
          error={errors.country?.message}
          registration={register("country", {
            required: "Country is required",
          })}
        />

        <div className="mt-2">
          <AuthButton type="submit" loading={isSubmitting}>
            Next
          </AuthButton>
        </div>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-[#63716E]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
