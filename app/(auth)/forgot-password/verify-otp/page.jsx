"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/api/authApi";
import AuthButton from "@/components/ui/AuthButton";

const TIMER_SECONDS = 90;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (otp.length < 4) {
      toast.error("Please enter the complete 4-digit code");
      return;
    }
    const email = sessionStorage.getItem("fp_email");
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp: Number(otp) }).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "OTP verified!");
        sessionStorage.setItem("fp_token", res.data.token);
        sessionStorage.setItem("fp_email", res.data.email);
        router.push("/forgot-password/reset-password");
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Invalid or expired OTP.");
      setOtp("");
    }
  };

  // ── Resend ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    const email = sessionStorage.getItem("fp_email");
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    try {
      await resendOtp({ email }).unwrap();
      toast.success("New code sent to your email");
      setOtp("");
      setTimeLeft(TIMER_SECONDS);
      setExpired(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to resend. Try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#203430]">
          Verify Your Identity
        </h1>
        <p className="text-sm text-[#63716E] mt-1">
          Enter the 4-digit code we sent to your Email to continue.
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#203430]">Code</label>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          shouldAutoFocus
          inputType="tel"
          renderSeparator={null}
          containerStyle={{ display: "flex", gap: "12px", width: "100%" }}
          renderInput={(props, index) => (
            <input
              {...props}
              placeholder="—"
              style={{}}
              className={`
                !w-full h-16 text-center text-xl font-bold rounded-2xl
                bg-gray-100 border-2 outline-none text-[#203430]
                placeholder:text-gray-300 placeholder:font-normal placeholder:text-base
                transition-all duration-150
                ${
                  otp[index]
                    ? "border-primary bg-white shadow-[0_0_0_3px_rgba(245,120,2,0.12)]"
                    : "border-transparent focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,120,2,0.08)]"
                }
              `}
            />
          )}
        />
      </div>

      {/* Timer + resend */}
      <p className="text-center text-sm text-[#63716E]">
        {expired ? (
          <>
            Code expired.{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primary hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </>
        ) : (
          <>
            Try after{" "}
            <span className="font-semibold text-primary">
              {formatTime(timeLeft)}
            </span>
          </>
        )}
      </p>

      {/* Verify button */}
      <AuthButton
        type="button"
        loading={isVerifying}
        onClick={handleVerify}
        disabled={otp.length < 4}
      >
        Verify
      </AuthButton>
    </div>
  );
}
