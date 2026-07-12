import { useForm } from "react-hook-form";
import { useCreateDealMutation } from "@/redux/api/services/dealApi";
import { toast } from "react-toastify";

export default function CreateDealModal({ targetId, onClose }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [createDeal, { isLoading }] = useCreateDealMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("target_id", targetId);
    formData.append("amount", data.price);
    formData.append("description", data.description);
    formData.append("valid_until", data.validUntil);
    formData.append("duration", `${data.duration} days`);

    try {
      await createDeal(formData).unwrap();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-2">
      <h3 className="text-xl font-bold text-gray-700 mb-3">
        Create a custom offer
      </h3>

      <hr className="border-gray-100 mb-4 w-full" />

      {/* Offer Description */}
      <div className="flex flex-col gap-2 mb-1">
        <label className="text-xs font-semibold text-gray-500">
          Offer Description
        </label>
        <textarea
          placeholder="Maximum 2500 words"
          rows={4}
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 2500,
              message: "Description must be 2500 characters or fewer",
            },
          })}
          className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400 resize-none min-h-[120px]"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="mb-6" />

      {/* Price / Valid Until / Duration */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500">Price</label>
          <input
            type="number"
            {...register("price", {
              required: "Required",
              min: { value: 1, message: "Must be greater than 0" },
              valueAsNumber: true,
            })}
            className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500">
            Offer Valid Until
          </label>
          <input
            type="date"
            min={todayStr}
            {...register("validUntil", {
              required: "Required",
              validate: value =>
                value >= todayStr || "Date must be in the future",
            })}
            className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800"
          />
          {errors.validUntil && (
            <p className="text-xs text-red-500">{errors.validUntil.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500">
            Deal Duration
          </label>
          <div className="relative">
            <input
              type="number"
              {...register("duration", {
                required: "Required",
                min: { value: 1, message: "Must be at least 1 day" },
                valueAsNumber: true,
              })}
              className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-2.5 pr-12 text-sm outline-none text-gray-800"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              days
            </span>
          </div>
          {errors.duration && (
            <p className="text-xs text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between w-full border-t border-gray-100 pt-6 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-bold text-[#006253] hover:text-[#004b40] transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Offer"}
        </button>
      </div>
    </form>
  );
}
