"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import {
  useVerifyRegistrationOtpMutation,
  useResendRegistrationOtpMutation,
} from "@/redux/api/authApi";
import AuthButton from "@/components/ui/AuthButton";

const TIMER_SECONDS = 90;

export default function RegistrationVerifyOtpPage() {
  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] =
    useVerifyRegistrationOtpMutation();
  const [resendOtp, { isLoading: isResending }] =
    useResendRegistrationOtpMutation();

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);

  // Guard: need email from previous step
  useEffect(() => {
    if (!sessionStorage.getItem("reg_email")) {
      router.replace("/registration");
    }
  }, [router]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const formatTime = s =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleVerify = async () => {
    if (otp.length < 4) {
      toast.error("Please enter the complete 4-digit code");
      return;
    }

    const email = sessionStorage.getItem("reg_email");
    try {
      const res = await verifyOtp({ email, otp: Number(otp) }).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "Email verified! Welcome to ReelUP 🎉");
        // Clean up all registration session keys
        ["reg_role", "reg_info", "reg_email"].forEach(k =>
          sessionStorage.removeItem(k),
        );
        router.push("/login");
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Invalid or expired OTP.");
      setOtp("");
    }
  };

  const handleResend = async () => {
    const email = sessionStorage.getItem("reg_email");
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
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Verify Your Email</h1>
        <p className="text-sm text-gray mt-1">
          Enter the 4-digit code we sent to your email to activate your account.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-black">Code</label>
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
                bg-gray-100 border-2 outline-none text-black
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
      <p className="text-center text-sm text-gray">
        {expired ? (
          <>
            Code expired.{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </>
        ) : (
          <>
            Time remain{" "}
            <span className="font-semibold text-primary">
              {formatTime(timeLeft)}
            </span>
            {" · "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </>
        )}
      </p>

      <AuthButton type="button" loading={isVerifying} onClick={handleVerify}>
        Verify & Continue
      </AuthButton>
    </div>
  );
}
