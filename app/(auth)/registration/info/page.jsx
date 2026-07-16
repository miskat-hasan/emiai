"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { useGetCountriesQuery } from "@/redux/api/services/commonApi";
import CustomSelect from "@/components/ui/CustomSelect";
import CountryCodeSelect from "@/components/ui/CountryCodeSelect";
import AuthBackButton from "@/components/ui/AuthBackButton";

export default function RegistrationInfoPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    if (!sessionStorage.getItem("reg_role")) {
      router.replace("/registration");
    }
  }, [router]);

  const { data: countriesData, isLoading: isCountriesLoading } =
    useGetCountriesQuery();
  const countries = countriesData?.data ?? [];

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("reg_role");

    if (!storedRole) {
      router.replace("/registration");
      return;
    }

    setRole(storedRole);
  }, [router]);

  const requiresBusinessFields = role === "advertiser" || role === "agency";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Repopulate the form when landing here via the back button — sessionStorage
  // isn't available at first client render (it's read here in an effect, not
  // as useForm's defaultValues), so this hydrates once on mount instead.
  useEffect(() => {
    const saved = sessionStorage.getItem("reg_info");
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch {
        // malformed/stale value — ignore, form just starts blank
      }
    }
    setHydrated(true);
  }, [reset]);

  const onSubmit = data => {
    sessionStorage.setItem("reg_info", JSON.stringify(data));
    router.push(
      requiresBusinessFields
        ? "/registration/document"
        : "/registration/password",
    );
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
          label={requiresBusinessFields ? "Company Name" : "Name"}
          type="text"
          placeholder={requiresBusinessFields ? "e.g. Company" : "e.g. Johnson"}
          error={errors.name?.message}
          registration={register("name", {
            required: "This field is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
        />

        {requiresBusinessFields && (
          <AuthInput
            label="Company Address"
            type="text"
            placeholder="e.g. Dhaka, Bangladesh"
            error={errors.company_address?.message}
            registration={register("company_address", {
              required: "Company address is required",
            })}
          />
        )}

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

        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Phone Number
          </label>
          <div className="flex gap-2">
            <Controller
              name="phone_code"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <CountryCodeSelect
                  value={field.value}
                  onChange={dial => field.onChange(dial)}
                  error={errors.phone_code?.message}
                />
              )}
            />
            <input
              type="tel"
              placeholder="123 654 7896"
              {...register("phone", { required: "Phone number is required" })}
              className="flex-1 bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <CustomSelect
              label="Country"
              placeholder="Select your country"
              options={countries}
              valueKey="code"
              labelKey="name"
              search
              isLoading={isCountriesLoading}
              value={field.value}
              onChange={field.onChange}
              error={errors.country?.message}
            />
          )}
        />

        <div className="mt-2 flex gap-2">
          <AuthBackButton />
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
