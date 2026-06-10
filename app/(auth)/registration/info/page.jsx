"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

export default function RegistrationInfoPage() {
  const router = useRouter();

  // Guard: must have chosen a role first
  useEffect(() => {
    if (!sessionStorage.getItem("reg_role")) {
      router.replace("/registration");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = data => {
    sessionStorage.setItem("reg_info", JSON.stringify(data));
    router.push("/registration/password");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Join the Network</h1>
        <p className="text-sm text-gray mt-1">
          Create your account and start connecting today.
        </p>
      </div>

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
            minLength: { value: 2, message: "At least 2 characters" },
          })}
        />
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="e.g. jonson@gmail.com"
          error={errors.email?.message}
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
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
