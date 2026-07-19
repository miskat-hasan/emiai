// components/dashboard/profile/AddAgencyModal.jsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomSelect from "@/components/ui/CustomSelect";
import { useGetAllUsersQuery } from "@/redux/api/services/userApi";
import { useStoreAgencyMutation } from "@/redux/api/services/managerApi";
import { PERMISSION_DEFS } from "./permissionDefs";
import ToggleSwitch from "@/components/ui/ToggleButton";

const emptyPermissions = PERMISSION_DEFS.reduce((acc, def) => {
  acc[def.key] = false;
  return acc;
}, {});

export default function AddAgencyModal({ open, onClose }) {
  const [isExclusive, setIsExclusive] = useState(false);
  const [permissions, setPermissions] = useState(emptyPermissions);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { agency: "" },
  });

  const { data: agencyUsersData, isLoading: isAgencyUsersLoading } =
    useGetAllUsersQuery({ role: "agency", per_page: 50 }, { skip: !open });

  const [storeAgency, { isLoading: isSaving }] = useStoreAgencyMutation();

  const agencyOptions = agencyUsersData?.data?.data ?? [];

  const togglePermission = key => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAndReset = () => {
    reset({ agency: "" });
    setIsExclusive(false);
    setPermissions(emptyPermissions);
    onClose();
  };

  const onSubmit = async data => {
    const permissionsPayload = PERMISSION_DEFS.reduce((acc, def) => {
      acc[def.key] = permissions[def.key] ? 1 : 0;
      return acc;
    }, {});

    try {
      const res = await storeAgency({
        user_id: data.agency,
        exclusive: isExclusive ? 1 : 0,
        permissions: permissionsPayload,
      }).unwrap();

      if (res?.success !== false) {
        toast.success(res?.message ?? "Agency added successfully!");
        closeAndReset();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to add agency.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FAF6F0] w-full max-w-xl rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-[#202626] mb-6">Add Agency</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="agency"
            control={control}
            rules={{ required: "Agency is required" }}
            render={({ field }) => (
              <CustomSelect
                label="Agency"
                placeholder="Select an Agency"
                options={agencyOptions}
                valueKey="id"
                labelKey="name"
                search
                isLoading={isAgencyUsersLoading}
                value={field.value}
                onChange={field.onChange}
                error={errors.agency?.message}
              />
            )}
          />

          <div className="flex items-center gap-4 sm:pt-6 px-1">
            <span className="text-xs font-bold text-[#202626]">Exclusive</span>
            <button
              type="button"
              onClick={() => setIsExclusive(!isExclusive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isExclusive
                  ? "bg-gradient-to-r from-[#FF5C26] to-[#FF7A45]"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isExclusive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Permissions — multi-select checkboxes, since the payload needs
              five independent booleans, not one chosen value. */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500">
              Permissions
            </label>
            <div className="bg-[#F1EDE7] rounded-xl p-2 space-y-0.5">
              {PERMISSION_DEFS.map(def => (
                <div
                  key={def.key}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-black/5"
                >
                  <span className="text-xs font-medium text-[#202626]">
                    {def.label}
                  </span>

                  <ToggleSwitch
                    checked={permissions[def.key]}
                    onChange={() => togglePermission(def.key)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={closeAndReset}
              disabled={isSaving}
              className="text-sm font-bold text-[#1C4E3F] hover:opacity-80 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#FF5C26] text-white text-xs font-bold px-6 py-3 rounded-xl hover:opacity-90 shadow-sm transition-opacity cursor-pointer disabled:opacity-50 min-w-[110px]"
            >
              {isSaving ? "Adding..." : "Add Agency"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
