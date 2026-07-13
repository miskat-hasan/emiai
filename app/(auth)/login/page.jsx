// app/(auth)/login/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/slices/authSlice";
import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { AppleIcon, GoogleIcon } from "@/components/common/Svg";
import { getRoleHomeRoute } from "@/lib/roleRoutes";
import { rebuildEcho } from "@/lib/echo";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      const res = await loginUser(data).unwrap();

      if (res?.success && res?.data) {
        const userData = res.data;

        dispatch(setUser(userData));

        document.cookie = `token=${userData.token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        document.cookie = `role=${userData.role}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        
        rebuildEcho();

        toast.success("Welcome back!");
        const route = getRoleHomeRoute(userData.role);
        router.push(route);
      }
    } catch (err) {
      const msg =
        err?.data?.message ??
        err?.message ??
        "Invalid email or password. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Welcome Back</h1>
        <p className="text-sm text-gray mt-1">
          Log in to your Reelup to continue managing your account
        </p>
      </div>

      {/* Form */}
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

        <div className="flex flex-col gap-1.5">
          <AuthInput
            label="Password"
            type="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            registration={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-black hover:text-primary transition-colors hover:underline"
            >
              Forgot Password
            </Link>
          </div>
        </div>

        <div className="mt-2">
          <AuthButton type="submit" loading={isLoading}>
            Log In
          </AuthButton>
        </div>
      </form>

      {/* Social login */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray font-medium">
            Or Continue With
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AuthButton variant="social" type="button">
            <GoogleIcon />
            <span>Google</span>
          </AuthButton>
          <AuthButton variant="social" type="button">
            <AppleIcon />
            <span>Apple</span>
          </AuthButton>
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray">
        Don&apos;t have an account?{" "}
        <Link
          href="/registration"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
