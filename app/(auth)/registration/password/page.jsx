"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import {
  getRegistrationFile,
  clearRegistrationFiles,
} from "@/lib/registrationFileStore";
import AuthBackButton from "@/components/ui/AuthBackButton";

export default function RegistrationPasswordPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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
    const documentFile = getRegistrationFile("document");

    // advertiser/agency must have gone through the document step and still
    // have the file in memory — if it's missing (e.g. user refreshed
    // mid-flow, which wipes the in-memory store), send them back rather
    // than submitting an incomplete registration.
    if ((role === "advertiser" || role === "agency") && !documentFile) {
      toast.error(
        "Your registration certificate was lost. Please re-upload it.",
      );
      router.push("/registration/document");
      return;
    }

    const fd = new FormData();
    fd.append("role", role);
    fd.append("name", info.name ?? "");
    fd.append("email", info.email ?? "");
    fd.append("phone", info.phone ?? "");
    fd.append("phone_code", info.phone_code ?? "");
    fd.append("country", info.country ?? "");
    fd.append("password", password);
    fd.append("password_confirmation", password_confirmation);
    fd.append("agree_to_terms", 1);

    if (info.company_address)
      fd.append("company_address", info.company_address);
    if (documentFile) fd.append("document", documentFile);

    try {
      const res = await registerUser(fd).unwrap();

      if (res?.success) {
        toast.success(
          res.message ?? "Account created! Please verify your email.",
        );
        sessionStorage.setItem("reg_email", info.email);
        clearRegistrationFiles();
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

        <div className="mt-2 flex gap-2">
          <AuthBackButton />
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
