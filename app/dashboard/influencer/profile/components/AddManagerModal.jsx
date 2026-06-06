"use client";

import { useForm } from "react-hook-form";
import { X } from "lucide-react";

export default function AddManagerModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      viewDeal: true,
      acceptRejectDeals: true,
      chatWithClient: true,
      viewPortfolio: true,
      manageContests: true,
      viewEarning: true,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    console.log("Adding New Business Manager Payload:", data);
    // Submit to your database API here
    reset();
    onClose();
  };

  // Permission items list configuration array matching design
  const permissionsList = [
    { id: "viewDeal", label: "View Deal" },
    { id: "acceptRejectDeals", label: "Accept/Reject Deals" },
    { id: "chatWithClient", label: "Chat With Client" },
    { id: "viewPortfolio", label: "View Portfolio" },
    { id: "manageContests", label: "Manage Contests" },
    { id: "viewEarning", label: "View Earning" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="w-full max-w-[640px] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_58%,#FFF6EE_100%)] rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Form Body Wrap */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Add Business Manager</h3>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Form Input Stack Row Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="here....."
                {...register("fullName", { required: "Full name is required" })}
                className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray mb-1.5">Email</label>
              <input
                type="email"
                placeholder="here...."
                {...register("email", { required: "Email address is required" })}
                className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray mb-1.5">Phone Number</label>
              <input
                type="text"
                placeholder="here....."
                {...register("phone", { required: "Phone record required" })}
                className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray mb-1.5">Country</label>
              <div className="relative">
                <select
                  {...register("country", { required: "Please pick a option" })}
                  className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none appearance-none focus:border-primary/40 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">here....</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Switch Block Segments */}
          <div className="space-y-4 pt-2">
            <span className="block text-xs font-semibold text-gray">Permission</span>
            
            <div className="space-y-3.5">
              {permissionsList.map((item) => {
                const isChecked = watch(item.id);
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">{item.label}</span>
                    
                    {/* Custom Toggle Switch matching the primary orange gradients */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isChecked}
                        onChange={(e) => setValue(item.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-primary"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row CTA Options */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary cursor-pointer text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              {isSubmitting ? "Adding..." : "Add Manager"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}