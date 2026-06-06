"use client";

import { useForm } from "react-hook-form";

export default function PasswordTab() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPasswordVal = watch("newPassword");

  const onSubmit = async (data) => {
    console.log("Password Modification Dispatched", data);
    reset(); // Secure clear string fields
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-black">Change Password</h3>
        <p className="text-xs text-gray mt-0.5">Manage your secret account keys securely</p>
      </div>

      <hr className="border-gray-100" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray mb-1.5">Current Password</label>
          <input
            type="password"
            placeholder="Set Password"
            {...register("currentPassword", { required: "Current validation payload string required" })}
            className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray mb-1.5">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            {...register("newPassword", {
              required: "New target password cannot be empty",
              minLength: { value: 6, message: "Must contain at least 6 characters" },
            })}
            className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray mb-1.5">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmPassword", {
              required: "Please retype your entry setting",
              validate: (val) => val === newPasswordVal || "Passwords fields must match exactly",
            })}
            className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? "Processing modification..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}