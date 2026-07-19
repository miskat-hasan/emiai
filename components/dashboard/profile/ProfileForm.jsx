"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Building2,
  Eye,
  EyeOff,
  MapPinHouse,
} from "lucide-react";
import { useGetCountriesQuery } from "@/redux/api/services/commonApi";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation,
} from "@/redux/api/services/userApi";
import { setUser } from "@/redux/slices/authSlice";
import { saveAuthSession } from "@/lib/auth-storage";
import CustomSelect from "@/components/ui/CustomSelect";
import CountryCodeSelect from "@/components/ui/CountryCodeSelect";
import UploadBox from "@/components/ui/UploadBox";

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
  const [documentFile, setDocumentFile] = useState(null);
  const [documentError, setDocumentError] = useState(false);
  const role = user?.role;

  const requiresBusinessFields = role === "advertiser" || role === "agency";

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updateUser, { isLoading: isSavingProfile }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: isSavingPassword }] =
    useUpdatePasswordMutation();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useGetCountriesQuery();

  const countries = countriesData?.data ?? [];

  const aboutDefaultValues = useMemo(
    () => ({
      name: user?.name ?? "",
      company_address: user?.company_address ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      phone_code: user?.phone_code ?? "",
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
    fd.append("phone_code", data.phone_code ?? "");
    fd.append("country", data.country);
    if (requiresBusinessFields && data.company_address) {
      fd.append("company_address", data.company_address);
    }
    if (avatarFile) fd.append("avatar", avatarFile);
    if (requiresBusinessFields && documentFile) {
      fd.append("document", documentFile);
    }

    try {
      const res = await updateUser(fd).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "Profile updated successfully!");
        const updatedUser = res.data ?? { ...user, ...data };
        dispatch(setUser(updatedUser));
        saveAuthSession({ ...updatedUser, token: undefined });
        onAvatarSaved?.();
        setDocumentFile(null);
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
          {role === "advertiser" || role === "agency" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <FieldIcon Icon={Building2} />
                  <input
                    type="text"
                    {...registerAbout("name", {
                      required: "Company Name is required",
                    })}
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
                  Company Address
                </label>
                <div className="relative">
                  <FieldIcon Icon={MapPinHouse} />
                  <input
                    type="text"
                    {...registerAbout("company_address")}
                    className={inputClass}
                  />
                </div>
                {aboutErrors.company_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {aboutErrors.company_address.message}
                  </p>
                )}
              </div>
            </>
          ) : (
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
          )}

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
                  />
                )}
              />
              <input
                type="tel"
                placeholder="123 654 7896"
                {...registerAbout("phone")}
                className="flex-1 bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
            </div>
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
          {requiresBusinessFields && (
            <div>
              {user?.document && !documentFile && (
                <a
                  href={user.document}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline mb-1.5 inline-block"
                >
                  View current certificate
                </a>
              )}
              <UploadBox
                label="Registration Certificate"
                accept=".doc,.docx,.pdf"
                hint="DOC, PDF"
                file={documentFile}
                onChange={file => {
                  setDocumentFile(file);
                  setDocumentError(false);
                }}
                onRemove={() => setDocumentFile(null)}
              />
              {documentError && (
                <p className="text-xs text-red-500 mt-1">
                  Registration certificate is required.
                </p>
              )}
            </div>
          )}
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
                type={showOldPassword ? "text" : "password"}
                placeholder="Current Password"
                {...registerPassword("old_password", {
                  required: "Current password is required",
                })}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                {...registerPassword("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                {...registerPassword("new_password_confirmation", {
                  required: "Please confirm your new password",
                  validate: val =>
                    !newPasswordVal ||
                    val === newPasswordVal ||
                    "Passwords must match exactly",
                })}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
