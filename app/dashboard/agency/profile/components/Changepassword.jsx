// components/Changepassword.jsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';

const Changepassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const newPasswordVal = watch("newPassword");

  const onSubmit = async (data) => {
    // Mimic API delay payload handling
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password Mutation Payload Submitted:", data);
  };

  return (
    <div>
      {/* ── SECTION 2: PASSWORD WORKSPACE ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div>
          <h3 className="text-lg font-bold text-black">Change Password</h3>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Password</label>
            <input
              type="password"
              placeholder="Set Password"
              {...register("currentPassword", { required: "Current password is required" })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-[#FF5C26]/40 focus:bg-white transition-all"
            />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" }
              })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-[#FF5C26]/40 focus:bg-white transition-all"
            />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => !newPasswordVal || val === newPasswordVal || "Passwords must match exactly",
              })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-[#FF5C26]/40 focus:bg-white transition-all"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {isSubmitting ? "Processing modification..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Changepassword;