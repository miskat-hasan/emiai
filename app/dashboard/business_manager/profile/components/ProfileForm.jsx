"use client";

import { useForm } from "react-hook-form";

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "Mia Torres",
      email: "ghuiodshglhdsglh@gmail.com",
      number: "+1 236 564 4598",
      country: "Bangladesh",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordVal = watch("newPassword");

  const onSubmit = async (data) => {
    console.log("Unified Client Data Layer Submission", data);
    // Fires combined payload data variables directly into your server endpoint pipeline
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* ── SECTION 1: ABOUT ME INFO ── */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-black">About me</h3>
          <p className="text-xs text-gray mt-0.5">Information about me</p>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">Mail</label>
            <input
              type="email"
              {...register("email", { required: "Email path is required" })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">Number</label>
            <input
              type="text"
              {...register("number", { required: "Contact number required" })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray mb-1.5">Country</label>
            <input
              type="text"
              {...register("country", { required: "Country value required" })}
              className="w-full bg-gray-50 border border-gray-100 text-black text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white text-sm font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Edit
          </button>
        </div>
      </div>



    </form>
  );
}