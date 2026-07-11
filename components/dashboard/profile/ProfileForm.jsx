"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { User, Phone, Globe2, Lock } from "lucide-react";
import { useGetCountriesQuery } from "@/redux/api/services/commonApi";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation,
} from "@/redux/api/services/userApi";
import { setUser } from "@/redux/slices/authSlice";
import { saveAuthSession } from "@/lib/auth-storage";
import CustomSelect from "@/components/ui/CustomSelect";

const inputClass =
  "w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all";

function FieldIcon({ Icon }) {
  return (
    <Icon
      size={16}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  );
}

export default function ProfileForm({ user, avatarFile, onAvatarSaved }) {
  const dispatch = useDispatch();

  const [updateUser, { isLoading: isSavingProfile }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: isSavingPassword }] =
    useUpdatePasswordMutation();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useGetCountriesQuery();

  const countries = countriesData?.data ?? [];

  const aboutDefaultValues = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      country: user?.country ?? "",
    }),
    [user],
  );

  const {
    register: registerAbout,
    handleSubmit: handleSubmitAbout,
    control,
    reset: resetAbout,
    formState: { errors: aboutErrors },
  } = useForm({ defaultValues: aboutDefaultValues });

  useEffect(() => {
    resetAbout(aboutDefaultValues);
  }, [aboutDefaultValues, resetAbout]);

  const onSubmitAbout = async data => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("phone", data.phone);
    fd.append("country", data.country);
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      const res = await updateUser(fd).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "Profile updated successfully!");
        const updatedUser = res.data ?? { ...user, ...data };
        dispatch(setUser(updatedUser));
        saveAuthSession({ ...updatedUser, token: undefined });
        onAvatarSaved?.();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to update profile.");
    }
  };

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const newPasswordVal = watch("new_password");

  const onSubmitPassword = async data => {
    try {
      const res = await updatePassword(data).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "Password changed successfully!");
        resetPassword();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to change password.");
    }
  };

  return (
    <div className="space-y-10">
      {/* ── About me ── */}
      <form onSubmit={handleSubmitAbout(onSubmitAbout)} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black leading-tight">
              About me
            </h3>
            <p className="text-xs text-gray">Basic information about you</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <FieldIcon Icon={User} />
              <input
                type="text"
                {...registerAbout("name", { required: "Name is required" })}
                className={inputClass}
              />
            </div>
            {aboutErrors.name && (
              <p className="text-xs text-red-500 mt-1">
                {aboutErrors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              Mail
            </label>
            <input
              type="email"
              disabled
              {...registerAbout("email")}
              className="w-full bg-gray-100 border border-gray-100 text-gray/70 text-sm rounded-xl px-4 py-3 outline-none cursor-not-allowed"
            />
            <p className="text-[11px] text-gray mt-1">
              Email can&apos;t be changed here.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              Number
            </label>
            <div className="relative">
              <FieldIcon Icon={Phone} />
              <input
                type="text"
                {...registerAbout("phone", {
                  required: "Contact number required",
                })}
                className={inputClass}
              />
            </div>
            {aboutErrors.phone && (
              <p className="text-xs text-red-500 mt-1">
                {aboutErrors.phone.message}
              </p>
            )}
          </div>

          <div>
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
                  error={aboutErrors.country?.message}
                  className="[&>label]:text-xs [&>label]:font-semibold [&>label]:text-gray"
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer mt-4"
          >
            {isSavingProfile ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>

      {/* ── Password ── */}
      <form
        onSubmit={handleSubmitPassword(onSubmitPassword)}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Lock size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black leading-tight">
              Change Password
            </h3>
            <p className="text-xs text-gray">Use a strong, unique password</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <FieldIcon Icon={Lock} />
              <input
                type="password"
                placeholder="Current Password"
                {...registerPassword("old_password", {
                  required: "Current password is required",
                })}
                className={inputClass}
              />
            </div>
            {passwordErrors.old_password && (
              <p className="text-xs text-red-500 mt-1">
                {passwordErrors.old_password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              New Password
            </label>
            <div className="relative">
              <FieldIcon Icon={Lock} />
              <input
                type="password"
                placeholder="New Password"
                {...registerPassword("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
                className={inputClass}
              />
            </div>
            {passwordErrors.new_password && (
              <p className="text-xs text-red-500 mt-1">
                {passwordErrors.new_password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <FieldIcon Icon={Lock} />
              <input
                type="password"
                placeholder="Confirm New Password"
                {...registerPassword("new_password_confirmation", {
                  required: "Please confirm your new password",
                  validate: val =>
                    !newPasswordVal ||
                    val === newPasswordVal ||
                    "Passwords must match exactly",
                })}
                className={inputClass}
              />
            </div>
            {passwordErrors.new_password_confirmation && (
              <p className="text-xs text-red-500 mt-1">
                {passwordErrors.new_password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
          <button
            type="submit"
            disabled={isSavingPassword}
            className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer mt-4"
          >
            {isSavingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
